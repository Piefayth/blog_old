---
title: RenderMeshV2 & Multiple Worlds
subtitle: Let's Perform Surgery on the Player Loop
peek: Initializing and updating default systems with custom update loops and multiple worlds.
image: default
---
post: |
    _This article assumes a working knowledge of basic Unity ECS concepts. Just getting started? Have a look at the [Unity ECS Forums](https://forum.unity.com/forums/entity-component-system-and-c-job-system.147/) as well as the [ECS Samples](https://github.com/Unity-Technologies/EntityComponentSystemSamples)._

    _This article was written for version `0.0.27` of the Unity.Entities package._

    ***

    Anyone who has been working with ECS for a while will tell you, you're regularly nursing your project back to health from a bad case of API churn. Most recently for me, I had to convert my project to use `RenderMeshV2`. Previously, I had a custom update loop where I had a client and server world each created with `new World()` and I manually updated every system. It's not the most ergonomic way to go about it, but it works and you're always certain what order your systems execute in. The old transform and render systems were easy to create and update manually, but I just couldn't get this approach working with `RenderMeshV2`.

    A little googling led me to the `DefaultWorldInitialization.Initialize` method. Using this to create your worlds creates all the default systems you'd find in a regular world. Systems like, say, `RenderMeshV2` or the `SimulationSystemGroup`. Great. Create the client world, create the server world, then just stick them in the update loop with `ScriptBehaviourUpdateOrder.UpdatePlayerLoop(params World[])`!


    Oh. Well, that API was there the _last_ time I looked. The `World[]` signature of that method is gone now. It accepts a singular World, and passing two consecutive Worlds will remove the first.

    But, admittedly, it's straightforward enough to create the worlds, snag the relevant systems from them, and update them from a `MonoBehaviour`. 

    ```c#
    Client client;
    Server server;
    PresentationSystemGroup clientRender;
    SimulationSystemGroup clientSim;

    void Awake() {
        DefaultWorldInitialization.Initialize("Server World", false);
        server = World.Active.GetOrCreateManager<Server>();
        DefaultWorldInitialization.Initialize("Client World", false);
        client = World.Active.GetOrCreateManager<Client>();
        clientSim = World.Active.GetOrCreateManager<SimulationSystemGroup>();
        clientRender = World.Active.GetOrCreateManager<PresentationSystemGroup>();
    }

    void Update() {
        clientRender.Update();
    }

    void FixedUpdate() {
        server.Update();
        client.Update();
        clientSim.Update();
    }
    ```

    Add an entity with `RenderMesh`, `LocalToWorld`, `Translation`, `Rotation`, and `NonUniformScale` to the client world, and it should draw as expected. 
    
    ![alt text](ecsRender1 "My Cool Image")

    Easy! 
    
    We've met the simple requirement of controlling our update loops individually while still having access to `RenderMeshV2`. This is great, but there are still some problems. Here's what I see.


    1. ALL the default systems are still running in the default world, and simply calling `.Dispose()` on it throws all kinds of errors. So does manually cleaning up the systems. We aren't using the default world, so let's put a stop to that.
    2. The presentation group is still running on the server. We won't be rendering anything there, so that's just wasting precious cycles. The server may or may not need the simulation group, depending on if you care about the results of the transform system.
    3. We are still updating from a `MonoBehaviour`.

    The first problem is the simplest to solve. In fact, it's *exactly* the problem that `ICustomBootstrap` was invented to solve. The interface is simple.

    ```c#
    public class Bootstrap : ICustomBootstrap {
        public List<Type> Initialize(List<Type> types) {
            // When this is called, World.Active is the world being initialized
            // The list of types returned will be the systems that are updated
        }
    }
    ```

    Our `Bootstrap` will be called on the default world initialization just by virtue of having the `ICustomBootstrap` interface. Given that, we can simply remove everything from the default world when it's initialized.

    ```c#
    if (World.Active.Name == "Default World") {
        return new List<Type>();
    }
    ```

    It stands to reason we can also remove the presentation layer from the server world here, and of course we can! But how do we know which systems are involved with the presentation layer? They're conveniently all tagged with `[UpdateInGroup(typeof(PresentationSystemGroup))]` and we can use that data to remove them.

    ```
    if (World.Active.Name == "Server World") {
        for (int ti = 0; ti < types.Count; ti++) {
            var attrs = types[ti].GetCustomAttributes(false);
            for (int i = 0; i < attrs.Length; i++) {
                if (attrs[i].GetType() == typeof(UpdateInGroupAttribute)) {
                    UpdateInGroupAttribute group = (UpdateInGroupAttribute) attrs[i];
                    if (group.GroupType == typeof(PresentationSystemGroup)) {
                        types.RemoveAt(ti);
                        ti--;
                    }
                }
            }
        }
    }

    return types;
    ```

    Now that we have our custom bootstrap, we're mostly no longer bogged down by the fact we used the default world initialization. I'd still like to remove as much logic from the MonoBehaviour as possible. Furthermore, I noticed some of the Unity staff discussing moving the simulation and presentation groups to places like PreUpdate and LateUpdate. Are we able to leverage those internal update loops as well?

    Enter the new PlayerLoop API.

    ```
    using UnityEngine.Experimental.LowLevel;
    using UnityEngine.Experimental.PlayerLoop;
    ```

    I've yet to find complete documentation on this API, but it's easy to see what's inside. Some of the methods from ScriptBehaviourUpdateOrder look interesting.

    ```
    PlayerLoopSystem playerLoopSystem = ScriptBehaviourUpdateOrder.CurrentPlayerLoop;
    PlayerLoopSystem[] subsystems = playerLoopSystem.subSystemList;

    for (int i = 0; i < subsystems.Length; i++) {
        PlayerLoopSystem system = subsystems[i];
        Debug.Log(system.type)
    }
    ```

    This outputs a list of systems like `PreUpdate, Update, LateUpdate, FixedUpdate`. Each of these are also of the type `PlayerLoopSystem`, so it stands to reason we can iterate the subsystems of each one. Inspecting the contents of each will lead you to some familiar ECS systems! So we're in the right place, we just need to manipulate the subsystem list of the update phase we would like to modify.

    ```
    CustomUpdateSystem customUpdateSystem = new CustomUpdateSystem(new ComponentSystem[] { client, server });

    for ...
        if (systems[i].type == typeof(FixedUpdate)) {
            PlayerLoopSystem fixedUpdateSystem = systems[i];
        
            List<PlayerLoopSystem> fixedUpdateSystems = new List<PlayerLoopSystem>(fixedUpdateSystem.subSystemList);
            PlayerLoopSystem customPlayerLoop = new PlayerLoopSystem();
            customPlayerLoop.type = typeof(CustomUpdateSystem);
            customPlayerLoop.updateDelegate = customUpdateSystem.MyFixedUpdate;
            fixedUpdateSystems.Add(customPlayerLoop);
        
            fixedUpdateSystem.subSystemList = fixedUpdateSystems.ToArray();
            playerLoopSystem.subSystemList[i] = fixedUpdateSystem;
        }
    }

    ScriptBehaviourUpdateOrder.SetPlayerLoop(playerLoopSystem);
    ```

    The above code creates a new `PlayerLoopSystem` and configures it to use a user-defined type for its execution logic. Then it inserts the user defined `PlayerLoopSystem` into the `FixedUpdate` loop subsystems. Note that this change does NOT automatically propagate back to ScriptBehaviourUpdateOrder, so we must call `SetPlayerLoop` with our modified playerLoopSystem. But what's a "`CustomUpdateSystem`"?

    It can be anything you want that can provide a delegate! In this case, I'm using the following:

    ```
    class CustomUpdateSystem {
        List<ScriptBehaviourManager> systems;

        public CustomUpdateSystem(params ScriptBehaviourManager[] systems) {
            this.systems = new List<ScriptBehaviourManager>(systems);
        }

        public void MyFixedUpdate() {
            foreach (ScriptBehaviourManager system in systems) {
                system.Update();
            }
        }
    }
    ```

    This implementation is nothing more than a class that takes a list of systems when it's created and updates them when `MyFixedUpdate` is called. `MyFixedUpdate` will then update each system individually. Though I haven't tried, I assume this approach will work with any stage of the player loop.
    
    Be warned that everything in this article subverts the default Unity bootstrap, so in an actual game you must manage your own system update order. If you'd like to manage system update order programmatically, it may be useful to take advantage of making `ComponentSystemGroup`s, adding systems to them with `AddSystemToUpdateList()`, then updating the groups with `group.Update()`.

    Want something you can run? [Check out the project for this article here](https://github.com/Piefayth/ecs_render_multiworld).
