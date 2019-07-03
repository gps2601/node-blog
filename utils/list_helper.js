const dummy = (blogs) => {
    return 1
}

const totalLikes = (listOfBlogs) => {
    return listOfBlogs.reduce((a,b) => a + b.likes, 0)
}

const favouriteBlog = (listOfBlogs) => {
    return listOfBlogs.reduce((prev, curr) => prev.likes > curr.likes ? prev : curr)
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}