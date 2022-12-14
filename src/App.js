import React, { Component } from "react";
import ParticlesBg from 'particles-bg'
import Sigin from "./components/Sigin/Signin";
import Register from "./components/Register/Register";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import './App.css';


const USER_ID = 'dejavudaniel';
const PAT = '5353881fbd5b446c8a1ab1e2279ff0db';
const APP_ID = 'face-detect';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';



let imageGlobal = '';

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            IMAGE_URL: '',
            box: {},
            route: 'signin',
        }
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFacebox = (box) => {
        console.log(box);
        this.setState({ box: box });
    }


    onInputChange = (event) => {
        this.setState({ input: event.target.value });
        imageGlobal = event.target.value;
        return imageGlobal
    }



    onButtonSubmit = () => {
        this.setState({ IMAGE_URL: this.state.input });

        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": imageGlobal
                        }

                    }
                }
            ]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
            },
            body: raw
        };

        fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
            .then(response => response.json())
            .then(result => this.displayFacebox(this.calculateFaceLocation(result)))
            .catch(error => console.log('error', error));



    }

    onRouteChange = (route) => {
        this.setState({ route: route })
    }



    render() {
        return (
            <div className="App">
                <Navigation onRouteChange={this.onRouteChange} route={this.state.route}/>
                {this.state.route === 'home'
                    ? <div>
                        <Logo />
                        <Rank />
                        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
                        <FaceRecognition box={this.state.box} IMAGE_URL={this.state.IMAGE_URL} />
                    </div>
                    : (
                        this.state.route === 'signin'
                        ? <Sigin onRouteChange={this.onRouteChange} />
                        : <Register onRouteChange={this.onRouteChange} />
                    )
                }
                <ParticlesBg color="#149df2" num={300} type="cobweb" bg={true} />
            </div>
        );
    }
} export default App;
