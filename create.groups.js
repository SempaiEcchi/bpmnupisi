import axios from "axios";

async function createStudentGroup() {

    let data = JSON.stringify({
        "id": "students",
        "name": "Students",
        "type": "students"
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/engine-rest/group/create',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: data
    };


    return axios.request(config)


}

async function addPermission() {
    return axios.post('http://localhost:8080/engine-rest/authorization/create', {
        type: 1,
        permissions: ["ACCESS",],  // Permission to read (access) the tasklist
        userId: null,

        resourceId: "tasklist",
        groupId: "students",
        resourceType: 0,

    })
        .then(response => {
            console.log('Authorization created successfully:', response.data);
        })
        .catch(error => {
            console.error('Error creating authorization:', error.response ? error.response.data : error.message);
        });
}


addPermission();