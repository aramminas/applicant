import Firebase from '../Firebase'

/* Tests Data */ /* (public) */
const getTestData = () => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`/tests`).once('value').then(function(snapshot) {
            let testsData = snapshot.val()
            if(testsData && Object.keys(testsData).length !== 0 && testsData.constructor === Object){
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
                reject({message: 'Database error. Objects `Test` not found!'})
            }
        }).catch(error => {
            reject({message: `Database error. 'Tests' data! ${error.message}`})
        })
    })
}

/* Remove Test By Id */ /* (public) */
const removeTest = (id) => {
    return new Promise(function(resolve, reject) {
        deleteTestImages(id).then(function() {
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

/* Update data */ /* (public) */
const updateData = (table, id, data) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(table).child(id).update(data,function (error) {
            if(error){
                reject({message: `Database error. 'Technology' data! ${error.message}`})
            }else {
                resolve({message: true})
            }
        }).catch(error => {
            reject({message: `Database error. 'Technology' data! ${error.message}`})
        })
    })
}

/* Remove Test Question  */ /* (public) */
const removeTestQuestion = (id, data) => {
    const besidesThisElement = data.tests.filter(el => el.id !== id)
    const delData = data.tests.filter(el => el.id === id)[0]

    const updateTestData = {
        tests: besidesThisElement
    }

    return new Promise(function(resolve, reject) {
        if(delData.imageName !== ""){
            deleteImage(delData.imageName).then((response) => {
                if(response === true){
                    updateData("tests/",data.id, updateTestData)
                        .then(responseQuestion => {
                            if(responseQuestion.message === true){
                                resolve({message: true})
                            }else {
                                reject({message: `Database error. 'Test question' data! ${responseQuestion.message}`})
                            }
                        })
                        .catch(error => {
                            reject({message: `Database error. 'Test question' data! ${error.message}`})
                    })
                }
            }).catch(error => {
                reject(error)
            })
        }else{
            updateData("tests/",data.id, updateTestData)
                .then(response => {
                    if(response.message === true){
                        resolve({message: true})
                    }else {
                        reject({message: `Database error. 'Test question' data! ${response.message}`})
                    }
                })
                .catch(error => {
                    reject({message: `Database error. 'Test question' data! ${error.message}`})
                })
        }
    })
}

/* Upload Image  */ /* (static) */
const uploadImage = (data) => {
    return new Promise((resolve, reject) => {
        let url = ""
        if(data.file){
            let storageRef = Firebase.storage.ref(`storage/images/tests`)
            let uploadTask = storageRef.child(`/${data.name}`).put(data.file)
            uploadTask.on('state_changed', function(snapshot){
                // 😷 handling promise Id | let id = snapshot?.metadata?.generation || null
            }, function(error) {
                reject({message:`Failed to upload image: ${error.message}`})
            }, function() {
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    if(downloadURL){
                        resolve({downloadURL})
                    }else{
                        reject({message:`Failed to load image's URL: ${url}`})
                    }
                })
            })
        }
    })
}

/* Add / Edit Question  */ /* (public) */
const addEditQuestion = (action, id, data, test) => {
    return new Promise(function(resolve, reject) {
        if(action === "edit"){
            const editData = {
                id: data.id,
                question: data.question,
                imageUrl: "",
                imageName: "",
                image: data.image,
                options: data.options,
                rightAnswers: data.rightAnswers,
                score: data.score,
                type: data.type,
            }

            if(data.type === "quiz"){
                editData.codeData = data.codeData
                editData.multiAnswer = data.multiAnswer
            }else if(data.type === "logical"){
                editData.optionsOrText = data.optionsOrText
            }

            if(data.score !== data.currentScore){
                test.totalScore = test.totalScore - data.currentScore + data.score
            }

            // if there is an old image and a new one is added
            if(data.currentImageName !== "" && data.imageData.file){
                deleteImage(data.currentImageName).then(removeImage => {
                    if(removeImage === true){
                        data.imageData.name = editData.imageName = `${Date.now()}_${data.imageData.name}`
                        uploadImage(data.imageData).then(newImage => {
                            if(newImage.downloadURL !== ""){
                                editData.imageUrl = newImage.downloadURL
                                updateQuestion(test, id, editData, data).then(response => {
                                    if(response.message === true){
                                        resolve({message: true})
                                    }else{
                                        reject({message: `Database error. 'Test question edit' data! ${response.message}`})
                                    }
                                }).catch(error => {
                                    reject({message: `Database error! ${error.message}`})
                                })
                            }
                        }).catch(error=>{
                            reject({message: `Storage error! ${error.message}`})
                        })
                    }else{
                        reject({message: `Storage error. 'question old image not removed' ! ${removeImage.message}`})
                    }
                }).catch(function(error) {
                    reject({message: `Storage error. question  image ! ${error.message}`})
                })
            }
            // if the image does not change or delete
            else if(data.currentImageName !== "" && !data.imageData.file){
                // if the image does not change
                if(editData.image){
                    editData.imageUrl = data.imageUrl
                    editData.imageName = data.currentImageName
                    updateQuestion(test, id, editData, data).then(response => {
                        if(response.message === true){
                            resolve({message: true})
                        }else{
                            reject({message: `Database error. 'Test question edit' data! ${response.message}`})
                        }
                    }).catch(error => {
                        reject({message: `Database error! ${error.message}`})
                    })
                }
                // if the image is deleted
                else if(!editData.image){
                    deleteImage(data.currentImageName).then(removeImage => {
                        if(removeImage === true){
                            updateQuestion(test, id, editData, data).then(response => {
                                if(response.message === true){
                                    resolve({message: true})
                                }else{
                                    reject({message: `Database error. 'Test question edit' data! ${response.message}`})
                                }
                            }).catch(error => {
                                reject({message: `Database error! ${error.message}`})
                            })
                        }else{
                            reject({message: `Storage error. 'question old image not removed' ! ${removeImage.message}`})
                        }
                    }).catch(function(error) {
                        reject({message: `Storage error. question  image ! ${error.message}`})
                    })
                }
            }
            // if not the old image, but a new one was added
            else if(data.currentImageName === "" && data.imageData.file){
                data.imageData.name = editData.imageName = `${Date.now()}_${data.imageData.name}`
                uploadImage(data.imageData).then(newImage => {
                    if(newImage.downloadURL !== ""){
                        editData.imageUrl = newImage.downloadURL
                        updateQuestion(test, id, editData, data).then(response => {
                            if(response.message === true){
                                resolve({message: true})
                            }else{
                                reject({message: `Database error. 'Test question edit' data! ${response.message}`})
                            }
                        }).catch(error => {
                            reject({message: `Database error! ${error.message}`})
                        })
                    }
                }).catch(error=>{
                    reject({message: `Storage error! ${error.message}`})
                })
            }
            // if there is no old image and no new one is added
            else if(data.currentImageName === "" && !data.imageData.file){
                updateQuestion(test, id, editData, data).then(response => {
                    if(response.message === true){
                        resolve({message: true})
                    }else{
                        reject({message: `Database error. 'Test question edit' data! ${response.message}`})
                    }
                }).catch(error => {
                    reject({message: `Database error! ${error.message}`})
                })
            }
        }else if(action === "add"){
            const addData = {
                id: data.id,
                question: data.question,
                imageUrl: "",
                imageName: "",
                options: data.options,
                rightAnswers: data.rightAnswers,
                score: data.score,
                type: data.type,
            }

            test.totalScore += data.score

            if(data.type === "quiz"){
                addData.codeData = data.codeData
                addData.multiAnswer = data.multiAnswer
            }else if(data.type === "logical"){
                addData.optionsOrText = data.optionsOrText
            }

            if(data.imageData.file){
                data.imageData.name = addData.imageName = `${Date.now()}_${data.imageData.name}`
                uploadImage(data.imageData).then(newImage => {
                    if(newImage.downloadURL !== ""){
                        addData.imageUrl = newImage.downloadURL
                        test.tests.push(addData)
                        updateData("tests/", id, test).then(response => {
                            if(response.message === true){
                                resolve({message: true})
                            }else{
                                reject({message: `Database error. 'Test question edit' data! ${response.message}`})
                            }
                        }).catch(error => {
                            reject({message: `Database error! ${error.message}`})
                        })
                    }
                }).catch(error=>{
                    reject({message: `Storage error! ${error.message}`})
                })
            }else if(!data.imageData.file){
                test.tests.push(addData)
                updateData("tests/", id, test).then(response => {
                    if(response.message === true){
                        resolve({message: true})
                    }else{
                        reject({message: `Database error. 'Test question edit' data! ${response.message}`})
                    }
                }).catch(error=>{
                    reject({message: `Database error. 'Test question edit' data! ${error.message}`})
                })
            }
        }
    })
}

/* Upload Question  */ /* (static) */
const updateQuestion = (test, id, editData, data) => {
    return new Promise(function(resolve, reject) {
        let index = test.tests.map(val => val.id).indexOf(data.id)
        if(index !== -1){
            test.tests.splice(index, 1, editData)
            updateData("tests/", id, test).then(response => {
                if(response.message === true){
                    resolve({message: true})
                }else{
                    reject({message: `Database error. 'Test question edit' data! ${response.message}`})
                }
            }).catch(error=>{
                reject({message: `Database error. 'Test question edit' data! ${error.message}`})
            })
        }else {
            reject({message: `Database error. 'Test question not found!' `})
        }
    })
}

/* Add New Data  */ /* (public) */
const addNewData = (table, id, data) => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`${table}/${id}`).set({
            ...data
        },function(error) {
            if (error) {
                reject({message: `Database error. 'Test question Add' data! ${error.message}`})
            } else {
                resolve({message: true})
            }
        }).catch(error=>{
            reject({message: `Database error. 'Test question Add' data! ${error.message}`})
        })
    })
}

/* Get All Tests Results  */ /* (public) */
const getAllTestsResults = () => {
    return new Promise(function(resolve, reject) {
        Firebase.database.ref(`tests-results`).once('value').then(function(snapshot) {
            const results = snapshot.val() || {}
            if(Object.keys(results).length !== 0 && results.constructor === Object){
                resolve(results)
            }else if(Object.keys(results).length === 0){
                reject({message: 'Database error. Objects `Test results` not found!'})
            }
        }).catch(error=>{
            reject({message: `Database error. 'Test test results data! ${error.message}`})
        })
    })
}

const FirebaseFunctions = {
    getTestData, // get test data from firebase db
    getTestDataById, // get test data by id from firebase db
    removeTest, // remove test by id from firebase db
    getTechData, // get technology data from firebase db
    updateData, // update data from firebase db
    removeTestQuestion, // remove test question from firebase db,
    addEditQuestion, // add/edit question by id in  firebase db,
    addNewData, // add new data in firebase db
    getAllTestsResults, // get all tests results from firebase db
}

export default FirebaseFunctions