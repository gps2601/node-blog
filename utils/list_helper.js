const dummy = (blogs) => {
    return 1
}

const totalLikes = (listOfBlogs) => {
    return listOfBlogs.reduce((a,b) => a + b.likes, 0)
}

module.exports = {
    dummy,
    totalLikes
}