import Firebase from "../Firebase"

export default function getUpdateChartData(type, action = "") {
    return new Promise((resolve, reject) => {
        let result = {}
        Firebase.database.ref(`/chart`).once('value').then(function(snapshot) {
            let chartData = snapshot.val() || {}

            if(Object.keys(chartData).length !== 0){
                result = chartData
            }else {
                reject({code: 404, message: "Database failed!"})
            }

            if(type === "applicant" || type === "test" || type === "passed-test"){
                updateData(type, result, action)
                return true
            }

            resolve(result)
        }).catch(error => {
            reject(error)
        })
    })
}

function updateData(type, data, action){
    if(type === "applicant"){
        if(action === "add"){
            data.applicants += 1
            data.applicantData = incrementData(data.applicantData)
        }else if(action === "remove"){
            if(data.applicants !== 0){
                data.applicants -= 1
            }
        }
    }else if(type === "test"){
        if(action === "add"){
            data.tests += 1
            data.testData = incrementData(data.testData)
        }else if(action === "remove"){
            if(data.tests !== 0){
                data.tests -= 1
            }
        }
    }else if(type === "passed-test"){
        data.pasedTests += 1
        data.pasedTestData = incrementData(data.testData)
    }

    update(data)
}

function incrementData(data) {
    // get the last date from database
    let dbLastMonth = data[11]["x"]
    let dbDate = new Date(dbLastMonth)
    let dbYear = dbDate.getFullYear()
    let dbMont = dbDate.getMonth()

    // get the date now
    let nowDate = new Date()
    let nowYear = nowDate.getFullYear()
    let nowMont = nowDate.getMonth()

    if(dbYear === nowYear){
        if(dbMont === nowMont){
            data[11]["y"] += 1
        }else{
            data.shift()
            data.push({x: `${nowDate}`, y: 1})
        }
    }else{
        data.shift()
        data.push({x: `${nowDate}`, y: 1})
    }

    return {...data}
}

function update(data) {
    Firebase.database.ref(`chart/`).set({...data}, function (error) {
        if(error){
            console.log(error)
        }
    })
}