import FormData from "form-data";
import axios from "axios";
import fs from "fs";

async function deploy() {
    let form = new FormData();
    form.append('deployment-name', 'My Deployments');
    form.append('deployment-source', 'Node');
    // form.append('tenant-id', '1');


    form.append('upisi.bpmn', fs.createReadStream('upisi.bpmn'));
    form.append('odabirpredmeta.form', fs.createReadStream('odabirpredmeta.form'));
    form.append('studentplatio.form', fs.createReadStream('studentplatio.form'));

    const options = {
        url: 'http://localhost:8080/engine-rest/deployment/create',
        method: 'POST',
        data: form,
        headers: form.getHeaders()
    };

    try {
        const response = await axios(options);
        console.log("Deployed");
    } catch (err) {
        console.error('Error during deployment:', err);
    }

}


async function start() {
    //json body


    const options = {
        url: 'http://localhost:8080/engine-rest/process-definition/key/upisi/start',
        method: 'POST',
        data: {
            variables: {
                student_contact_email: {
                    value: "leo.radocaj2@gmail.com"
                }
            }
        },
    };

    try {
        const response = await axios(options);
        console.log("Started process");
    } catch (err) {
        console.error('Error during deployment:', err);
    }

}


//
deploy().then(() => {
    start();
});

