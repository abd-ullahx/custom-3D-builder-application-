import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'

createInertiaApp({
  resolve: async name => {
    const pages = import.meta.glob('./pages/**/*.jsx')
    const pageModule = await pages[`./pages/${name}.jsx`]()
    
    // Extract the named export or default export
    const pageComponent = pageModule[name] || Object.values(pageModule).find(v => typeof v === 'function') || pageModule.default
    
    // Wrap with persistent layout
    pageComponent.layout = pageComponent.layout || (c => <Layout children={c} componentName={name} />)
    
    return { default: pageComponent }
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <Provider store={store}>
        <App {...props} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              borderRadius: '10px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0, 0, 0, 0.05)',
              padding: '12px 16px',
              fontSize: '13px',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '500',
              minWidth: '320px',
              maxWidth: '450px',
            },
            success: {
              style: {
                borderLeft: '5px solid #198754',
              },
              iconTheme: {
                primary: '#198754',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                borderLeft: '5px solid #dc3545',
              },
              iconTheme: {
                primary: '#dc3545',
                secondary: '#fff',
              },
            },
            loading: {
              style: {
                borderLeft: '5px solid #0dcaf0',
              },
            },
            blank: {
              style: {
                borderLeft: '5px solid #ffc107',
              },
            },
          }}
        />
      </Provider>
    )
  },
  progress: {
    delay: 0,
    color: '#FACC15',
    showSpinner: true,
  },
})
