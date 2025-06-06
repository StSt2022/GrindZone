import * as React from 'react';
import {Link} from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {styled} from '@mui/material/styles';
import {keyframes} from '@emotion/react';

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const flowingGradient = keyframes`
    0% {
        background-position: -200% center;
    }
    100% {
        background-position: 200% center;
    }
`;

const FooterContainer = styled(Box)(({theme}) => ({
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    backgroundColor: 'rgba(10, 5, 18, 0.97)',
    color: 'rgba(230, 220, 255, 0.7)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 'auto',
    zIndex: 10,
    isolation: 'isolate',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        background: `linear-gradient(90deg, transparent 0%, rgba(198, 126, 255, 0.5) 20%, #a96cff 50%, rgba(198, 126, 255, 0.5) 80%, transparent 100%)`,
        backgroundSize: '300% auto',
        animation: `${flowingGradient} 7s linear infinite`,
        zIndex: 1,
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
    },
}));

const SocialLink = styled(IconButton)(({theme}) => ({
    margin: theme.spacing(0, 1.2),
    color: 'rgba(230, 220, 255, 0.7)',
    transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    willChange: 'transform, color, box-shadow',
    '& .MuiSvgIcon-root': {
        fontSize: '1.7rem',
    },
    '&:hover': {
        color: '#d1a9ff',
        transform: 'translateY(-5px) scale(1.15)',
        boxShadow: `0 0 20px 3px rgba(198, 126, 255, 0.45)`,
    },
}));

function Footer() {
    return (
        <FooterContainer component="footer">
            <Container maxWidth="lg">
                <Grid container spacing={2} justifyContent="space-between" alignItems="center"
                      direction={{xs: 'column', sm: 'row'}}>
                    <Grid item xs={12} sm="auto" sx={{mb: {xs: 2, sm: 0}}}>
                        <Typography variant="h6" component={Link} to="/" sx={{
                            fontWeight: 700,
                            color: 'white',
                            textDecoration: 'none',
                            textShadow: '0 0 8px rgba(198, 126, 255, 0.6)',
                            transition: 'text-shadow 0.3s ease, opacity 0.3s ease',
                            letterSpacing: '.1rem',
                            '&:hover': {
                                textShadow: '0 0 15px rgba(198, 126, 255, 0.9)',
                                opacity: 0.9,
                            }
                        }}>
                            GRINDZONE
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm sx={{my: {xs: 2, sm: 0}}}>
                        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <SocialLink onClick={() => alert('Незабаром!')} aria-label="Facebook">
                                <FacebookIcon/>
                            </SocialLink>
                            <SocialLink onClick={() => alert('Незабаром!')} aria-label="Instagram">
                                <InstagramIcon/>
                            </SocialLink>
                            <SocialLink onClick={() => alert('Незабаром!')} aria-label="Twitter">
                                <TwitterIcon/>
                            </SocialLink>
                            <SocialLink onClick={() => alert('Незабаром!')} aria-label="LinkedIn">
                                <LinkedInIcon/>
                            </SocialLink>
                            <SocialLink onClick={() => alert('Незабаром!')} aria-label="GitHub">
                                <GitHubIcon/>
                            </SocialLink>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm="auto" sx={{mt: {xs: 2, sm: 0}}}>
                        <Typography variant="body2"
                                    sx={{color: 'rgba(230, 220, 255, 0.6)', fontSize: {xs: '0.75rem', sm: '0.8rem'}}}>
                            © {new Date().getFullYear()} GRINDZONE. Всі права захищено.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </FooterContainer>
    );
}

export default Footer;