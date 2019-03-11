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
            if (!post.meta && subDoc) {
                post.meta = subDoc
            } else if (subDoc) {
                post.post = subDoc
            }
        })

        let regex = /^---[\w\W]+---[\r|\n]+([\w\W]+)$/g
        let postContent = regex.exec(content)
        post.post = postContent[1]
        post.meta.id = postId

        fs.writeFileSync(`./public/posts/${postId}.json`, JSON.stringify(post))
        posts.push(post)
    })

    return posts
}

fs.writeFileSync(`./public/posts/index.json`, JSON.stringify(getPostData()))
