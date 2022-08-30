module.exports = {
    formatDates: date => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
}