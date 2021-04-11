import axios from 'axios'

const apiClient = axios.create( {
    baseURL: 'https://localhost:44334/api/World_Ports',
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json'

    }
});

export default {
    getPortByName(name) {
        return apiClient.get(`/GetPortName/info?name=${name}` )
    },
    getTheNearestPort(coordinates) {
         return apiClient.get(`/GetThePort/info?latitude=${coordinates[0]}&longitude=${coordinates[1]}`); 
    } ,
    getPortInRectangle(xMin, yMin, xMax, yMax) { 
        return apiClient.get(`/GetPortsInRectangle/info?xMin=${xMin}&yMin=${yMin}&xMax=${xMax}&yMax=${yMax}   `) 
    }


    
}