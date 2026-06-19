import { COLORS, BTN, GRADIENTS, SPACING } from '../../config/theme'

export default function CallToAction() {
    return (
        <section className={`${SPACING.sectionLg} bg-[${COLORS.primary}] relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl text-white mb-8">Ready to create your dream jersey?</h2>
                <p className="text-lg md:text-xl text-white/80 mb-12">
                    Join thousands of teams who trust EAY SPORTS for their custom sportswear needs.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className={`${BTN.secondary} text-lg md:text-xl px-8 md:px-9 py-3.5 md:py-5 hover:scale-105 transition-all shadow-2xl w-full sm:w-auto`}>
                      Get Started Now
                  </button>
                  <button className={`${BTN.secondary} text-lg md:text-xl px-8 md:px-9 py-3.5 md:py-5 hover:scale-105 transition-all shadow-2xl w-full sm:w-auto`}>
                      Become a Dealer
                  </button>
                </div>
            </div>
        </section>
    )
}