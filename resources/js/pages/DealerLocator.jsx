import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Mail, Search, Navigation, ZoomIn, ZoomOut, Compass, Info, ArrowLeft, Globe } from 'lucide-react'
import { SPACING } from '../config/theme'
import { router } from '@inertiajs/react'

export const DealerLocator = ({ dealers = [], areas = [], searchedZip = '', searchedDistance = 50, flashError = null, nearestFallback = false, exactMatch = false }) => {
  
  // Search parameters states
  const [zipInput, setZipInput] = useState(searchedZip || '')
  const [distance, setDistance] = useState(searchedDistance || 50)
  const [selectedDealerId, setSelectedDealerId] = useState(null)

  // Satellite layer switch states
  const [isSatellite, setIsSatellite] = useState(false)
  const streetLayerRef = useRef(null)
  const satelliteLayerRef = useRef(null)

  // Map element refs
  const mapElementRef = useRef(null)
  const leafletMapInstanceRef = useRef(null)
  const markersRef = useRef({})
  const userMarkerRef = useRef(null)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const dealerRefs = useRef({})

  // Dynamic coordinates registry from DB
  const ZIP_COORDINATES = useMemo(() => {
    const coords = {}
    areas.forEach(area => {
      coords[area.zip_code] = {
        latitude: parseFloat(area.latitude),
        longitude: parseFloat(area.longitude),
        name: `ZIP ${area.zip_code}`
      }
    })
    return coords
  }, [areas])

  // User position coordinates based on current searchZip (only when searched)
  const userCoords = useMemo(() => {
    if (searchedZip && ZIP_COORDINATES[searchedZip]) {
      return ZIP_COORDINATES[searchedZip]
    }
    return null
  }, [searchedZip, ZIP_COORDINATES])

  // Map all raw dealers to have unified structure
  const projectedDealers = useMemo(() => {
    return dealers.map(dealer => ({
      ...dealer,
      distanceVal: dealer.distance ? Math.round(dealer.distance) : null
    }))
  }, [dealers])

  // Filter and sort dealers by search radius for left directory column
  const filteredDealers = useMemo(() => {
    if (searchedZip && userCoords) {
      return projectedDealers
        .filter(dealer => dealer.distanceVal !== null && dealer.distanceVal <= distance)
        .sort((a, b) => (a.distanceVal || 0) - (b.distanceVal || 0))
    }
    return projectedDealers
  }, [projectedDealers, searchedZip, distance, userCoords])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Dynamic load of Leaflet CDN files
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script')
      script.id = 'leaflet-js'
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = () => {
        setLeafletLoaded(true)
      }
      document.body.appendChild(script)
    } else {
      if (window.L) {
        setLeafletLoaded(true)
      } else {
        const interval = setInterval(() => {
          if (window.L) {
            setLeafletLoaded(true)
            clearInterval(interval)
          }
        }, 100)
        return () => clearInterval(interval)
      }
    }
  }, [])

  // Initialize Leaflet Map Instance
  useEffect(() => {
    if (!leafletLoaded || !mapElementRef.current || leafletMapInstanceRef.current) return

    const L = window.L

    // Default to center of USA at wider zoom when no search done
    let centerLat = 39.5
    let centerLng = -98.35
    let initialZoom = 4
    if (userCoords) {
      centerLat = userCoords.latitude
      centerLng = userCoords.longitude
      initialZoom = 12
    } else if (dealers.length > 0) {
      centerLat = parseFloat(dealers[0].latitude)
      centerLng = parseFloat(dealers[0].longitude)
      initialZoom = 12
    }

    const map = L.map(mapElementRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([centerLat, centerLng], initialZoom)

    streetLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    })

    satelliteLayerRef.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    })

    // Initially add active layer based on state
    if (isSatellite) {
      satelliteLayerRef.current.addTo(map)
    } else {
      streetLayerRef.current.addTo(map)
    }

    leafletMapInstanceRef.current = map

    return () => {
      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove()
        leafletMapInstanceRef.current = null
      }
    }
  }, [leafletLoaded, userCoords, dealers])

  // Sync active map layers when toggled by user
  useEffect(() => {
    const map = leafletMapInstanceRef.current
    if (!map || !leafletLoaded) return

    if (isSatellite) {
      if (streetLayerRef.current) map.removeLayer(streetLayerRef.current)
      if (satelliteLayerRef.current) satelliteLayerRef.current.addTo(map)
    } else {
      if (satelliteLayerRef.current) map.removeLayer(satelliteLayerRef.current)
      if (streetLayerRef.current) streetLayerRef.current.addTo(map)
    }
  }, [isSatellite, leafletLoaded])


  // Sync Leaflet Map markers dynamically
  useEffect(() => {
    const map = leafletMapInstanceRef.current
    if (!map || !leafletLoaded) return

    const L = window.L

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => map.removeLayer(m))
    markersRef.current = {}

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current)
      userMarkerRef.current = null
    }

    // Add User position searched location marker
    if (userCoords) {
      const userIcon = L.divIcon({
        className: 'leaflet-custom-user',
        html: `
          <div class="relative flex items-center justify-center pointer-events-none">
            <span class="absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-40 animate-ping"></span>
            <div class="w-4.5 h-4.5 rounded-full bg-red-500 border-2 border-white shadow-lg flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      userMarkerRef.current = L.marker([userCoords.latitude, userCoords.longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans">
            <strong class="text-slate-800 text-xs block">Search Center</strong>
            <span class="text-[10px] text-slate-500 block mt-0.5">ZIP ${searchedZip || zipInput}</span>
          </div>
        `)
    }

    // Add Active Dealer Markers
    filteredDealers.forEach(dealer => {
      const isSelected = dealer.id === selectedDealerId
      
      const dealerIcon = L.divIcon({
        className: `leaflet-custom-dealer-${dealer.id}`,
        html: `
          <div class="relative flex flex-col items-center group transition-all duration-300">
            ${isSelected ? '<span class="absolute -top-1.5 inline-flex h-11 w-11 rounded-full bg-indigo-400 opacity-40 animate-ping"></span>' : ''}
            <div class="p-2 rounded-full shadow-2xl border-2 transition-all duration-300 ${
              isSelected 
                ? 'bg-indigo-600 text-white border-white scale-125' 
                : 'bg-white text-indigo-600 border-indigo-400 hover:border-indigo-600 hover:scale-110 shadow-indigo-100'
            }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="${isSelected ? 'fill-white/10' : ''}"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      })

      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${parseFloat(dealer.latitude)},${parseFloat(dealer.longitude)}`

      const marker = L.marker([parseFloat(dealer.latitude), parseFloat(dealer.longitude)], { icon: dealerIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans min-w-[150px]">
            <strong class="text-slate-800 text-xs block">${dealer.name}</strong>
            <span class="text-[10px] text-slate-500 block mt-0.5">${dealer.address}</span>
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 mt-2 hover:underline">
              Get Directions on Google Maps ↗
            </a>
          </div>
        `)
        .on('click', () => {
          handleSelectDealer(dealer.id)
        })

      markersRef.current[dealer.id] = marker
    })

    // Bounds centering
    if (filteredDealers.length > 0) {
      const selectedDealer = filteredDealers.find(d => d.id === selectedDealerId)
      if (selectedDealer) {
        map.setView([parseFloat(selectedDealer.latitude), parseFloat(selectedDealer.longitude)], 14, { animate: true })
      } else {
        const bounds = L.latLngBounds(filteredDealers.map(d => [parseFloat(d.latitude), parseFloat(d.longitude)]))
        if (userCoords) {
          bounds.extend([userCoords.latitude, userCoords.longitude])
        }
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
      }
    }
  }, [filteredDealers, selectedDealerId, userCoords, leafletLoaded])

  // Alert on flashError
  useEffect(() => {
    if (flashError) {
      alert(flashError)
    }
  }, [flashError])

  // Auto-select first matching dealer on load / filter change
  useEffect(() => {
    if (filteredDealers.length > 0) {
      setSelectedDealerId(filteredDealers[0].id)
    } else {
      setSelectedDealerId(null)
    }
  }, [filteredDealers])

  // Search handler (uses Inertia visit to filter from DB!)
  const handleSearch = useCallback((e) => {
    e.preventDefault()
    const cleanedZip = zipInput.trim()
    if (cleanedZip) {
      router.visit(`/dealer-locator?zip=${cleanedZip}&distance=${distance}`, {
        preserveState: true
      })
    } else {
      router.visit('/dealer-locator')
    }
  }, [zipInput, distance])

  // Zoom controls trigger
  const handleZoom = useCallback((factor) => {
    const map = leafletMapInstanceRef.current
    if (!map) return
    if (factor > 0) {
      map.zoomIn()
    } else {
      map.zoomOut()
    }
  }, [])

  // Reset focus view
  const handleResetView = useCallback(() => {
    const map = leafletMapInstanceRef.current
    if (!map || !leafletLoaded) return
    if (filteredDealers.length > 0) {
      const L = window.L
      const bounds = L.latLngBounds(filteredDealers.map(d => [parseFloat(d.latitude), parseFloat(d.longitude)]))
      if (userCoords) {
        bounds.extend([userCoords.latitude, userCoords.longitude])
      }
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [filteredDealers, userCoords, leafletLoaded])

  // Handle selected items
  const handleSelectDealer = useCallback((id) => {
    setSelectedDealerId(id)
    if (dealerRefs.current[id]) {
      dealerRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])


  return (
    <div className="pt-20 min-h-screen bg-slate-50 flex flex-col font-sans relative">
      <style>{`
        .leaflet-custom-user {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-custom-dealer {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1) !important;
          border: 1px solid #f1f5f9 !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1) !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white py-12 px-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className={`${SPACING.container} relative flex flex-col md:flex-row md:items-center md:justify-between gap-6`}>
          <div>
            <button 
              onClick={() => router.visit('/')} 
              className="flex items-center gap-2 text-indigo-200 hover:text-white mb-3 text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to Home
            </button>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">DEALER LOCATOR</h1>
            <p className="text-indigo-200 mt-2 text-base max-w-xl">
              Find authorized EAY SPORTS retail locations, custom apparel fitting hubs, and team order collection centers.
            </p>
          </div>
          
          {/* Top Search bar inside Header */}
          <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-wrap gap-3 items-end max-w-lg w-full">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs uppercase tracking-wider font-semibold text-indigo-200 mb-1.5">Zip Code</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 10001"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  className="w-full bg-white text-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <MapPin size={15} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>
            
            <div className="w-[140px]">
              <label className="block text-xs uppercase tracking-wider font-semibold text-indigo-200 mb-1.5">Distance</label>
              <select
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full bg-white text-slate-800 rounded-xl py-2.5 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
                <option value={500}>500 km</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="bg-white text-indigo-900 font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search size={16} /> Search
            </button>
          </form>
        </div>
      </div>

      {/* Main Dealer Portal Interface */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-12 py-6">

        {/* STATE 1: No search yet — show full-width search prompt */}
        {!searchedZip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-200 mb-6">
              <Search className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Find Dealers Near You</h2>
            <p className="text-slate-500 text-sm max-w-md leading-relaxed mb-8">
              Enter your ZIP code and select a search distance above, then click <strong>Search</strong> to discover authorized EAY SPORTS dealers in your area.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                <MapPin size={15} className="text-indigo-400" />
                <span>Dealer Locations</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                <Navigation size={15} className="text-indigo-400" />
                <span>Get Directions</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full">
                <Phone size={15} className="text-indigo-400" />
                <span>Contact Info</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STATE 2: Searched but no dealers found */}
        {searchedZip && filteredDealers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5 border-2 border-slate-200">
              <MapPin className="text-slate-300" size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">No Dealers Found</h2>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-2">
              No authorized dealers were found within <strong>{distance} km</strong> of ZIP code <strong>{searchedZip}</strong>.
            </p>
            <p className="text-slate-400 text-xs mb-6">Try increasing the distance or searching a different ZIP code.</p>
            <button
              onClick={() => router.visit('/dealer-locator')}
              className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Search size={15} /> Search Again
            </button>
          </motion.div>
        )}

        {/* STATE 3: Has results — show dealer list + map */}
        {searchedZip && filteredDealers.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden gap-6">

            {/* Nearest Fallback Banner */}
            {nearestFallback && (
              <div className="lg:col-span-12 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
                <span className="text-lg">⚠️</span>
                <div>
                  <strong>No dealers found within {searchedDistance} km of ZIP {searchedZip}.</strong>
                  <span className="ml-1 font-normal">Showing the nearest {filteredDealers.length} dealers instead — try increasing your search distance.</span>
                </div>
              </div>
            )}

            {/* Exact ZIP Match Banner */}
            {exactMatch && (
              <div className="lg:col-span-12 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm">
                <span className="text-lg">✅</span>
                <div>
                  <strong>{filteredDealers.length} dealer{filteredDealers.length > 1 ? 's' : ''} found</strong> with exact ZIP code match for <strong>{searchedZip}</strong>.
                </div>
              </div>
            )}
        
            {/* Left Column: Dealer Directory */}
            <div className="lg:col-span-4 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[700px]">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="font-semibold text-slate-700 text-sm tracking-wide">
                  {filteredDealers.length} Dealers Found
                </span>
                <span className="text-xs text-[#4F46E5] bg-indigo-50 px-2.5 py-1 rounded-full font-medium">
                  Near ZIP {searchedZip}
                </span>
              </div>

              {/* Directory List */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar" 
                data-lenis-prevent="true"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredDealers.map((dealer) => {
                    const isSelected = dealer.id === selectedDealerId
                    return (
                      <motion.div
                        key={dealer.id}
                        ref={el => dealerRefs.current[dealer.id] = el}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleSelectDealer(dealer.id)}
                        className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                          isSelected 
                            ? 'border-[#4F46E5] bg-indigo-50/50 shadow-md shadow-indigo-100' 
                            : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h3 className={`font-semibold text-sm transition-colors ${isSelected ? 'text-[#4F46E5]' : 'text-slate-800'}`}>
                            {dealer.name}
                          </h3>
                          {dealer.distanceVal !== null && (
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md flex-shrink-0">
                              {dealer.distanceVal} km
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1.5">
                          <MapPin size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                          <span>{dealer.address}</span>
                        </p>
                        {dealer.phone && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                            <Phone size={13} className="text-slate-400 flex-shrink-0" />
                            <span>{dealer.phone}</span>
                          </p>
                        )}
                        
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3.5 pt-3.5 border-t border-indigo-100/50 space-y-2.5 text-xs"
                          >
                            {dealer.email && (
                              <div className="flex items-center gap-1.5 text-slate-600">
                                <Mail size={12} className="text-slate-400" />
                                <a href={`mailto:${dealer.email}`} className="hover:underline text-[#4F46E5]">{dealer.email}</a>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Globe size={12} className="text-slate-400" />
                              <span className="text-slate-500">www.eaysports.com</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-slate-500 bg-indigo-50/30 p-2 rounded-lg mt-1 border border-indigo-100/20">
                              <Info size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <strong className="block text-[10px] text-indigo-900/60 uppercase font-semibold">Store Hours</strong>
                                <span className="text-[11px]">Mon-Sat: 9 AM - 8 PM, Sun: 11 AM - 6 PM</span>
                              </div>
                            </div>

                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${parseFloat(dealer.latitude)},${parseFloat(dealer.longitude)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full mt-3 bg-slate-900 text-white hover:bg-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                            >
                              <Navigation size={13} className="text-white transform -rotate-45" /> Get Directions (Open Google Maps)
                            </a>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Premium Leaflet Interactive Map */}
            <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative h-[700px]">
              
              {/* Map Controls Overlay */}
              <div className="absolute top-4 right-4 z-[999] flex flex-col gap-2 pointer-events-auto">
                <button 
                  onClick={() => handleZoom(1)} 
                  className="w-10 h-10 rounded-xl bg-white text-slate-700 hover:text-[#4F46E5] border border-slate-200 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>
                <button 
                  onClick={() => handleZoom(-1)} 
                  className="w-10 h-10 rounded-xl bg-white text-slate-700 hover:text-[#4F46E5] border border-slate-200 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>
                <button 
                  onClick={handleResetView} 
                  className="w-10 h-10 rounded-xl bg-white text-slate-700 hover:text-[#4F46E5] border border-slate-200 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Reset View"
                >
                  <Compass size={18} />
                </button>
                <button 
                  onClick={() => setIsSatellite(!isSatellite)} 
                  className={`w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer ${
                    isSatellite 
                      ? 'bg-indigo-600 text-white border-indigo-700' 
                      : 'bg-white text-slate-700 hover:text-[#4F46E5]'
                  }`}
                  title="Toggle Satellite View"
                >
                  <Globe size={18} />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 z-[999] bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-md font-medium tracking-wide pointer-events-none">
                <Navigation size={12} className="text-indigo-400 animate-pulse" />
                <span>Interactive Real Map • {isSatellite ? 'Satellite View' : 'Map View'} • Scroll Enabled</span>
              </div>

              {/* Leaflet Mount Element */}
              <div className="w-full h-full relative z-[1] bg-slate-100">
                {!leafletLoaded ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Loading Premium Map Engine...</span>
                  </div>
                ) : null}
                <div ref={mapElementRef} className="w-full h-full relative" style={{ minHeight: '100%' }} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

