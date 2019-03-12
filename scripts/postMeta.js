const fs = require('fs')
const yaml = require('js-yaml')
const path = require('path');


const getPostData = () => {
    const posts = []

    fs.readdirSync('./posts').forEach((file, index) => {
        const content = fs.readFileSync(`./posts/${file}`, 'utf8')
        const postId = path.parse(file).name
        if (postId == 'index') {
            return
        }
        

        let post = {}
        const doc = yaml.loadAll(content, (subDoc, i) => {
            if (subDoc.post) {
                post.post = subDoc.post
            } else if (subDoc.title) {
                post.meta = subDoc
            }
        })

        post.meta.id = postId
        fs.writeFileSync(`./public/posts/${postId}.json`, JSON.stringify(post))
        posts.push(post)
    })

    return posts
}

fs.writeFileSync(`./public/posts/index.json`, JSON.stringify(getPostData()))
