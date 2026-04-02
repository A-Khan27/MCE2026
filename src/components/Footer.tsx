export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'Space Grotesk' }}>
              Math Club Elections
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Department of Mathematics<br />
              Your voice matters. Make it count.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm">
              <li><a href="/candidates" className="text-slate-400 hover:text-indigo-400 transition-colors">View Candidates</a></li>
              <li><a href="/wishlist" className="text-slate-400 hover:text-indigo-400 transition-colors">Community Wishlist</a></li>
              <li><a href="/timeline" className="text-slate-400 hover:text-indigo-400 transition-colors">Election Timeline</a></li>
              <li><a href="/polls" className="text-slate-400 hover:text-indigo-400 transition-colors">Live Polls</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Election Committee</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              For any queries regarding the election process, contact the Election Committee at{' '}
              <a href="mailto:election@mathclub.edu" className="text-indigo-400 hover:underline">
                election@mathclub.edu
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm text-center sm:text-left">
            Developed by <span className="text-white font-medium">Ahsan Khan</span> | Publicity &amp; Publication Secretary, Math Club JUST (2025)
          </p>
          <p className="text-slate-500 text-sm">
            © 2026 Math Club. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}