import React from 'react';

const LandingPage = () => {
  const goToLogin = () => {
    // Simple navigation - adjust based on your routing setup
    window.location.href = '/login';
    // Or if using React Router: navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">🚗</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Eddie's Askan Automotive</h1>
          </div>
          <button
            onClick={goToLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Sign In →
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professional Automotive
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {" "}Management System
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Streamline your automotive shop operations with our comprehensive management platform. 
            From customer intake to final invoicing, we've got you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={goToLogin}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started →
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm">
              Watch Demo
            </button>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Everything You Need</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Vehicle Management", desc: "Track customer vehicles and maintenance history", icon: "🚗" },
              { title: "Service Tracking", desc: "Complete job management from estimates to invoicing", icon: "🔧" },
              { title: "Time Clock", desc: "Employee time tracking and labor management", icon: "⏰" },
              { title: "Customer Management", desc: "Comprehensive customer database", icon: "👥" }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                <p className="text-slate-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h3>
          <p className="text-lg text-slate-300 mb-8">
            Transform your automotive shop with professional management tools.
          </p>
          <button
            onClick={goToLogin}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all shadow-xl hover:scale-105"
          >
            Access Your Dashboard →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">© 2025 Eddie's Askan Automotive. Professional shop management made simple.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
