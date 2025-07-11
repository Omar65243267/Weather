import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import moment from 'moment';


export default function SimpleContainer() {
  const [temp, setTemp] = useState(null);
  const [date, setDate] = useState(moment().format('MMMM Do YYYY, h:mm a'));
 


useEffect(() => {
  // Set the date to the current date and time
  setDate(moment().format('MMMM Do YYYY, h:mm a'));
  // Fetch data from the API
  let cancelAxios;
  axios.get(
    'https://api.openweathermap.org/data/2.5/weather?lat=60.3&lon=25&appid=ceb66b4254724cac58078fa5df7c0a52&units=metric',
    {
      cancelToken: new axios.CancelToken((c) => {
        cancelAxios = c;
      })
    }
  )
    .then(response => {
      const data = response.data;
      const main = data.weather && data.weather[0] ? data.weather[0].main : '';
      const icon = data.weather && data.weather[0] ? data.weather[0].icon : '';
      const temperature = Math.round(data.main.temp);
      const temperature_max = Math.round(data.main.temp_max);
      const temperature_min = Math.round(data.main.temp_min);
      const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      
      setTemp({ current: temperature, max: temperature_max, min: temperature_min, main, 
                sunrise: sunriseTime, sunset: sunsetTime, icon });
      // Log the response data
      console.log(response);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
  return () => {
    if (cancelAxios) {
      cancelAxios();
    }
  }
}, []);

  return (
    <React.Fragment>
      <Container maxWidth="sm" style={{ marginTop: '200px' }}>
        <div style={{width:'500px', height:'450px', display: 'flex', flexDirection: 'column',
                      backgroundColor:'#2196f3', color:'white',
                       justifyContent: 'center', 
                       padding: '10px',borderRadius: '15px',boxShadow: '0 8px 18px rgba(0, 0, 0, 0.2)',}}>
                        {/* city & time*/}
                    <div style={{ textAlign: 'center', flexDirection: 'row', 
                          display: 'flex', justifyContent: 'center', alignItems: 'end'  }}>
                        <Typography variant="h3" gutterBottom style={{ marginLeft: '20px',
                          marginRight: '20px',marginBottom :'0px' }}>
                        Vantaa
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                        {date}
                      </Typography>
                    </div>
                <hr style={{margin: '20px '}} />
                {/* degree & description */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              marginTop: '20px', padding: '0 20px' }}>
                  {/* degree */}
                  <div>
                    <Typography variant="h1" gutterBottom style={{ textAlign:'left', marginTop: '20px' }}>
                     {temp !== null ? `${temp.current} °C` : 'Loading...'}
                    </Typography>
                    {/* sunrise & sunset */}
                    <div>
                    {temp && temp.sunrise && (
                      <Typography variant="h6">🌅  {temp.sunrise}</Typography>)}
                    {temp && temp.sunset && (
                      <Typography variant="h6">🌇  {temp.sunset}</Typography>)}
                  </div>
                    {/* min & max */}
                    
                    <div style={{ display: 'flex', flexDirection: 'row',  justifyContent: 'center', 
                                  marginTop: '20px', fontSize: '20px', 
                                  color: 'white', fontWeight: 'bold',
                                  alignItems: 'center',  }}>
                     <h5>{temp !== null ? `${temp.max} °C` : '--'}</h5>
                     <h5 style={{fontSize:'15px', margin:'10px'}}>/</h5>
                    <h5>{temp !== null ? `${temp.min} °C` : '--'}</h5>
                    </div>
                  </div>
                  
                   {/* Main description */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h3" gutterBottom style={{ textAlign: 'right', marginTop: '20px' }}>
                       {temp !== null ? temp.main : 'Loading...'}
                    </Typography>
                    {/*  weatter image icon */}
                    <div>
                      <img 
                        src={`https://openweathermap.org/img/wn/${temp ? temp.icon : ' 05d' }@2x.png`}
                        alt="Weather Icon"    
                        style={{ width: '200px', height: '200px' }}
                      />
                    </div>
                    
                  </div>
                </div> 
        </div>
      </Container>
      <Container maxWidth="sm" style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button variant="contained" 
        color="primary" startIcon={<CloudIcon />} onClick={() => window.location.reload()}>
          Refresh Weather
        </Button>
      </Container> 
    </React.Fragment>
  );
}

