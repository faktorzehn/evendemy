module.exports = {

    getAllLocations: (config) => {
        var locations = [...config.locations];
        return new Promise((resolve, reject) => {
            var sorted = locations.sort((a,b)=>{a.name.localeCompare(b.name)});
            resolve(sorted);
        });
    }
}