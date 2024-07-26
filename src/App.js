import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import ChangePassword from './views/pages/login/ChangePassword'
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const AllServices = React.lazy(() => import('./views/pages/services/AllServices'))
const AddService = React.lazy(() => import('./views/pages/services/AddService'))
const Edit = React.lazy(() => import('./views/pages/services/EditService'))
const Trips = React.lazy(() => import('./views/pages/Trips/Trips'))
const ServiceDetails = React.lazy(() => import('./views/pages/services/ServiceDetails'))
const TripDetails = React.lazy(() => import('./views/pages/Trips/TripDetails'))
const Profile = React.lazy(() => import('./views/pages/Host/Profile'))
const EditProfile = React.lazy(() => import('./views/pages/Host/EditProfile'))
const CustomTripsToBid = React.lazy(() => import('./views/pages/Custom/CustomTripsToBid'))
const TripToBidDetails = React.lazy(() => import('./views/pages/Custom/TripToBidDetails'))
const AddCustomService = React.lazy(() => import('./views/pages/Custom/AddCustomService'))
const AllBids = React.lazy(() => import('./views/pages/services/AllBids'))
const BidDetails = React.lazy(() => import('./views/pages/services/BidDetails'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/service/all" name="services" element={<AllServices />} />
          <Route exact path="/service/add" name="services" element={<AddService />} />
          <Route exact path="/service/edit/:id" name="services" element={<Edit />} />
          <Route exact path="/trips" name="trips" element={<Trips />} />
          <Route exact path="/trip/:id" name="trips" element={<TripDetails />} />
          <Route exact path="/service/:id" name="services" element={<ServiceDetails />} />
          <Route exact path="/service/bid/:id" name="services" element={<BidDetails />} />
          <Route exact path='/profile' name='Profile' element={<Profile />} />
          <Route exact path='/profile/edit' name='EditProfile' element={<EditProfile />} />
          <Route exact path='/bidding' name='Custom' element={<CustomTripsToBid />} />
          <Route exact path='/bidding/details/:id' name='Custom' element={<TripToBidDetails />} />
          <Route exact path='/bidding/service/:id' name='Custom' element={<AddCustomService />} />
          <Route exact path='/bidding/all' name='Custom' element={<AllBids />} />
          <Route exact path='/change-password' name='Password' element={<ChangePassword />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
