import { router } from '@inertiajs/react'

export const useHero = () => {
  const handleStartDesigning = () => {
    router.visit('/builder')
  }

  const handleBrowseCollection = () => {
    router.visit('/products')
  }

  return {
    handleStartDesigning,
    handleBrowseCollection
  }
}
