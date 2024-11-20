

import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { XCircle, PackageOpen } from 'lucide-react'
import { 
  Button, 
  Typography, 
  Container, 
  Box, 
  ThemeProvider, 
  createTheme 
} from '@mui/material'
import EmptyAnimation from '../../../components/common/animations/EmptyCartAnimations'

const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336', // Red color for error state
    },
    secondary: {
      main: '#2196f3', // Blue color for action buttons
    },
  },
})

export default function OrderFailed() {
  const navigate = useNavigate()

 

  const handleContactSupport = () => {
    // Navigate to the support page or open a support chat
    navigate('/account/orders')
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
           <EmptyAnimation icon={ <XCircle color={theme.palette.primary.main} className="w-28 h-28 sm:w-32 sm:h-32 "/>} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
              Order Failed
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Typography variant="body1" color="text.secondary" paragraph>
              We're sorry, but there was an issue processing your order. 
              Please try again the payment go to orders or contact our support team for assistance.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
             
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<PackageOpen />}
                onClick={handleContactSupport}
              >
                Go to Orders
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </ThemeProvider>
  )
}