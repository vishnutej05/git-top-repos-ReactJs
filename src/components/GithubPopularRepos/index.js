import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiUrl = 'https://apis.ccbp.in/popular-repos?language='

const GithubPopularRepos = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [repositoriesData, setRepositoriesData] = useState([])
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('ALL')

  const getRepositories = async languageFilter => {
    setIsLoading(true)
    const response = await fetch(`${apiUrl}${languageFilter}`)
    const fetchedData = await response.json()
    const updatedData = fetchedData.popular_repos.map(eachRepository => ({
      id: eachRepository.id,
      imageUrl: eachRepository.avatar_url,
      name: eachRepository.name,
      starsCount: eachRepository.stars_count,
      forksCount: eachRepository.forks_count,
      issuesCount: eachRepository.issues_count,
    }))
    // eslint-disable-next-line no-use-before-define
    setRepositories(updatedData, false)
  }

  useEffect(() => {
    getRepositories(languageFiltersData[0].id)
  }, [])

  const setRepositories = (fetchedData, loadingStatus) => {
    setRepositoriesData(fetchedData)
    setIsLoading(loadingStatus)
  }

  const renderRepositoriesList = () => (
    <ul className="repositories-cards-list-container">
      {repositoriesData.map(repositoryData => (
        <RepositoryItem
          key={repositoryData.id}
          repositoryData={repositoryData}
        />
      ))}
    </ul>
  )

  const renderLoader = () => (
    <div data-testid="loader">
      <Loader color="#0284c7" height={80} type="ThreeDots" width={80} />
    </div>
  )

  const setSelectedLanguageFilterAndGetRepositories = newFilterId => {
    setSelectedLanguageFilter(newFilterId)
    getRepositories(newFilterId)
  }

  const renderLanguageFiltersList = () => (
    <ul className="filters-list-container">
      {languageFiltersData.map(eachLanguageFilter => (
        <LanguageFilterItem
          isSelected={eachLanguageFilter.id === selectedLanguageFilter}
          key={eachLanguageFilter.id}
          languageFilter={eachLanguageFilter}
          setSelectedLanguageFilterAndGetRepositories={
            setSelectedLanguageFilterAndGetRepositories
          }
        />
      ))}
    </ul>
  )

  return (
    <div className="app-container">
      <div className="github-popular-repositories-container">
        <h1 className="heading">Popular</h1>
        {renderLanguageFiltersList()}
        {isLoading ? renderLoader() : renderRepositoriesList()}
      </div>
    </div>
  )
}

export default GithubPopularRepos
