import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Grid, Divider, FormControl, Select, MenuItem, Typography, Box, Card, CardContent } from '@mui/material';
import axios from 'axios';
import moment from 'moment-timezone';
import "moment/dist/locale/ar-dz";
import Prayer from './prayer';
import img1 from '../img/img-1.png';
import img2 from '../img/img-2.png';
import img3 from '../img/img-3.jpg';
import img4 from '../img/img-4.png';
import img5 from '../img/img-5.jpg';

moment.locale('ar-dz');

const availableCities = [
  { displayName: 'مكة المكرمة', apiName: 'Makkah al Mukarramah' },
  { displayName: 'المدينة المنورة', apiName: 'al Madinah al Munawwarah' },
  { displayName: 'الرياض', apiName: 'Riyadh' },
  { displayName: 'القصيم', apiName: 'Qassim' }
];

export default function MainContent() {
  const [timings, setTimings] = useState(null);
  const [selectCity, setSelectCity] = useState(availableCities[0]);
  const [today, setToday] = useState(moment().format('LL | HH:mm'));
  const [nextPrayer, setNextPrayer] = useState(null);
  const [remainingTime, setRemainingTime] = useState('00:00:00');

  const getTimings = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectCity.apiName}`);
      setTimings(response.data.data.timings);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  }, [selectCity]);

  useEffect(() => {
    getTimings();
    setToday(moment().format('LL | HH:mm'));
  }, [selectCity, getTimings]);

  useEffect(() => {
    if (!timings) return;

    const now = moment();
    const todayDate = moment().format('YYYY-MM-DD');

    const prayers = [
      { name: "الفجر", time: moment(`${todayDate} ${timings.Fajr}`, 'YYYY-MM-DD HH:mm') },
      { name: "الظهر", time: moment(`${todayDate} ${timings.Dhuhr}`, 'YYYY-MM-DD HH:mm') },
      { name: "العصر", time: moment(`${todayDate} ${timings.Asr}`, 'YYYY-MM-DD HH:mm') },
      { name: "المغرب", time: moment(`${todayDate} ${timings.Maghrib}`, 'YYYY-MM-DD HH:mm') },
      { name: "العشاء", time: moment(`${todayDate} ${timings.Isha}`, 'YYYY-MM-DD HH:mm') }
    ];

    let upcomingPrayer = prayers.find(prayer => prayer.time.isAfter(now)) || {
      name: "الفجر",
      time: moment(`${todayDate} ${timings.Fajr}`, 'YYYY-MM-DD HH:mm').add(1, 'days')
    };

    setNextPrayer(upcomingPrayer);

    const updateRemainingTime = () => {
      const diff = upcomingPrayer.time.diff(moment(), 'seconds');
      setRemainingTime(diff > 0 ? moment.utc(diff * 1000).format('HH:mm:ss') : '00:00:00');
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [timings]);

  return (
    <Box sx={{ padding: 4, backgroundColor: '#1a1a2e', minHeight: '100vh', color: 'white' }}>
      <Grid container spacing={4} alignItems="center" justifyContent="center" textAlign="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h4" fontWeight="bold">{today}</Typography>
          <Typography variant="h2" color="primary" fontWeight="bold">{selectCity.displayName}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: '#0f3460', padding: 3, borderRadius: '16px', boxShadow: 3, textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h5">المتبقي حتى صلاة {nextPrayer?.name || '...'}</Typography>
              <Typography variant="h3" fontWeight="bold" color="secondary">{remainingTime}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ backgroundColor: 'white', opacity: 0.2, marginY: 4 }} />

      <Grid container spacing={2} justifyContent="center" textAlign="center">
        {[
          { img: img1, name: 'الفجر', time: timings?.Fajr },
          { img: img2, name: 'الظهر', time: timings?.Dhuhr },
          { img: img3, name: 'العصر', time: timings?.Asr },
          { img: img4, name: 'المغرب', time: timings?.Maghrib },
          { img: img5, name: 'العشاء', time: timings?.Isha }
        ].map((prayer, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Prayer img={prayer.img} name={prayer.name} time={prayer.time} />
          </Grid>
        ))}
      </Grid>

      <FormControl sx={{ width: '100%', maxWidth: 300, marginTop: 4, marginX: 'auto' }}>
        <Select
          sx={{ border: '1px solid white', color: 'white', bgcolor: '#16213e' }}
          onChange={(e) => setSelectCity(availableCities.find(city => city.apiName === e.target.value))}
          value={selectCity.apiName}
        >
          {availableCities.map((city) => (
            <MenuItem key={city.apiName} value={city.apiName}>{city.displayName}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
