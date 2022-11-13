// Write your code here
// Write your code here
/* eslint-disable react/no-unknown-property */
import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  state = {vaccinationDetails: {}, apiStatus: apiConstants.initial}

  componentDidMount() {
    this.getVaccinationDetails()
  }

  getVaccinationDetails = async () => {
    this.setState({apiStatus: apiConstants.loading})
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)
    const data = await response.json()
    if (response.ok) {
      const weekVaccinationList = data.last_7_days_vaccination.map(each => ({
        vaccineDate: each.vaccine_date,
        dose1: each.dose_1,
        dose2: each.dose_2,
      }))
      const vaccinationByAgeList = data.vaccination_by_age
      const vaccinationByGenderList = data.vaccination_by_gender
      const obj = {
        weekVaccinationList,
        vaccinationByAgeList,
        vaccinationByGenderList,
      }
      this.setState({vaccinationDetails: obj, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  successView = () => {
    const {vaccinationDetails} = this.state
    const {
      weekVaccinationList,
      vaccinationByGenderList,
      vaccinationByAgeList,
    } = vaccinationDetails
    return (
      <div>
        <VaccinationCoverage weekVaccinationList={weekVaccinationList} />
        <VaccinationByGender
          vaccinationByGenderList={vaccinationByGenderList}
        />
        <VaccinationByAge vaccinationByAgeList={vaccinationByAgeList} />
      </div>
    )
  }

  failureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something Went Wrong</h1>
    </div>
  )

  loadingView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderDifferentViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.successView()
      case apiConstants.loading:
        return this.loadingView()
      case apiConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
        />
        <h1>Co-WIN</h1>
        <h1>CoWIN Vaccination in India</h1>
        <div>{this.renderDifferentViews()}</div>
      </div>
    )
  }
}

export default CowinDashboard
