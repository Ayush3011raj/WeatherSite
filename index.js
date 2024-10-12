import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const apikey = "caaca3ecd72241bd961120031241210"; 

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.get("/info", (req, res) => {
    res.render("info.ejs");
});

// Handle the form submission and fetch weather data
app.post("/", async (req, res) => {
    const lat = req.body.latitude;
    const lon = req.body.longitude;
    const locationQuery = `${lat},${lon}`;  // Construct the query as "latitude,longitude"

    try {
        // Fetch data using the correct format for the q parameter
        const result = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${lat},${lon}`);
        
        // Render info.ejs and pass condition data
        console.log(JSON.stringify(result.data));
            console.log(JSON.stringify(result.data.location.region));
        res.render("info.ejs", {
            city: result.data.location.region,
            country: result.data.location.country,
            condition: result.data.current.condition.text, 
            temp: result.data.current.temp_c,
            humidity: result.data.current.humidity,
            precp: result.data.current.precip_mm,
            feelsliketemp:result.data.current.feelslike_c
        });
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        res.send("An error occurred while fetching weather data.");
    }
});


app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
