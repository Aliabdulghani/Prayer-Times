import * as React from 'react'; // فقط مرة واحدة
import { Card, CardContent, CardMedia, Typography, CardActionArea, useTheme, useMediaQuery } from '@mui/material';

export default function Prayer({ img, name, time }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        width: '100%', // Make it fully responsive
        maxWidth: 300, // Limit maximum width for better appearance
        margin: 'auto', // Center the card
        marginBottom: 3,
        borderRadius: 2,
        transition: 'transform 0.3s',
        boxShadow: 3,
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 6,
        }
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          height={isSmallScreen ? '140' : '180'}
          image={img}
          alt={name}
          sx={{
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
        <CardContent sx={{ textAlign: 'center', padding: theme.spacing(2) }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: isSmallScreen ? '18px' : '22px',
              fontWeight: '600',
              color: theme.palette.primary.main,
              marginBottom: 1,
            }}
          >
            {name}
          </Typography>
          <Typography
            sx={{
              fontSize: isSmallScreen ? '28px' : '40px',
              fontWeight: 'bold',
              color: theme.palette.secondary.main,
            }}
          >
            {time}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
