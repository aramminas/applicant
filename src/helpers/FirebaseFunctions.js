import Firebase from '../Firebase'

/* Tests Data */ /* (public) */
const getTestData = () => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`/tests`).once('value').then(function(snapshot) {
            let testsData = snapshot.val() || {}
            if(Object.keys(testsData).length !== 0 && testsData.constructor === Object){
                let tempData = []
                // converting data for a table
                for (let property in testsData) {
                    if (Object.prototype.hasOwnProperty.call(testsData, property)) {
                        let item = testsData[property]
                        let itemPar = testsData[property].parameters
                        tempData = [...tempData,
                            {
                                icon: itemPar.technologyId,
                                name: itemPar.technologyId,
                                level: itemPar.testForLevel,
                                duration: itemPar.testDuration,
                                numberOfTests: item.tests.length,
                                createdAt: item.createdAt,
                                id: item.id,
                            }
                        ]
                    }
                }
                resolve(tempData)
            }else if(testsData == null){
                reject({message: 'Database error. Empty `Tests` data!'})
            }
        }).catch(error => {
            reject({message: `Database error. 'Tests' data! ${error.message}`})
        })
    })
}

/* Tests Data By Id */ /* (public) */
const getTestDataById = (id) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`/tests/${id}`).once('value').then(function(snapshot) {
            let testsData = snapshot.val() || {}
            if(Object.keys(testsData).length !== 0 && testsData.constructor === Object){
                resolve(testsData)
            }else if(Object.keys(testsData).length === 0){
                reject({message: 'Database error. Objects `Test` not deleted!'})
            }
        }).catch(error => {
            reject({message: `Database error. 'Tests' data! ${error.message}`})
        })
    })
}

/* Remove Test By Id */ /* (public) */
const removeTest = (id) => {
    return new Promise(function(resolve, reject) {
        deleteTestImages(id).then(function(data) {
            resolve({result: true})
        }).catch(error => {
            reject({message: `Database error. 'Tests' data! ${error.message}`})
        })
    })
}

/* Checking whether images are present in the test and deleting them from storage */  /* (static) */
const deleteTestImages = (id) => {
    return new Promise(function(resolve, reject) {
        getTestDataById(id).then(function(data) {
            let numberOfImages = 0
            let ready = 0
            let maxWaitingTime = 0
            let { tests } = data
            if(data && tests && tests.length > 0){
                for (const item of tests) {
                    if (item.imageName !== "") {
                        numberOfImages++
                        deleteImage(item.imageName)
                            .then(() => ready++)
                            .catch(error => {
                                reject(error)
                        })
                    }
                }
            }
            /* if there is no picture in the Test then delete the test */
            if(numberOfImages === 0){
                deleteTestData(id).then(function() {
                    resolve({result: true})
                }).catch(error => {
                    reject(error)
                })
            }

            if(numberOfImages > 0){
                let amount = setInterval(function () {
                    if(numberOfImages === ready){
                        clearInterval(amount)
                        deleteTestData(id).then(function() {
                            resolve({result: true})
                        }).catch(error => {
                            reject(error)
                        })
                    }
                    if(maxWaitingTime === 360){
                        clearInterval(amount)
                        reject('Database error. Maximum wait time reached!')
                    }
                    maxWaitingTime++
                },1000)
            }
        }).catch(error => {
            reject(error)
        })
    })
}

/*  deleting images from storage */ /* (static) */
const deleteImage = (data) => {
    return new Promise(function(resolve, reject) {
        let storageRef = Firebase.storage.ref(`storage/images/tests/`)
        storageRef.child(data).delete().then(function() {
            resolve(true)
        }).catch(function(error) {
            reject(error)
        })
    })
}

/* Deleting test data from the database */ /* (static) */
const deleteTestData = (id) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`/tests`).child(id).remove().then(function() {
            resolve({result: true})
        }).catch(error => {
            reject(error)
        })
    })
}

/* Technology Data */ /* (public) */
const getTechData = () => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`/technology`).once('value').then(function(snapshot) {
            let technologyData = snapshot.val() || {}
            if(Object.keys(technologyData).length !== 0 && technologyData.constructor === Object){
                resolve(technologyData)
            }else if(Object.keys(technologyData).length === 0){
                reject({message: 'Database error. Empty `Technology` data!'})
            }
        }).catch(error => {
            reject({message: `Database error. 'Technology' data! ${error.message}`})
        })
    })
}

const FirebaseFunctions = {
    getTestData, // get test data from firebase db
    getTestDataById, // get test data by id from firebase db
    removeTest, // remove test by id from firebase db
    getTechData, // get technology data from firebase db
}

export default FirebaseFunctions