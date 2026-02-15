export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-4xl font-black text-charcoal tracking-widest mb-4" style={{ letterSpacing: '0.15em' }}>
            SCYRA
          </div>
          <h1 className="text-2xl font-serif text-charcoal mb-2">Forgot password?</h1>
          <p className="text-text-secondary">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="card-soft rounded-3xl p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-white border border-black/10 focus:border-charcoal/30 focus:outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-charcoal text-white rounded-full font-medium hover:bg-charcoal-light transition-all hover:scale-[1.02]"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-charcoal hover:text-charcoal-light transition-colors underline"
            >
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
