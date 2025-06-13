('use client');
import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error('Error caught by boundary:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="w-full p-8 text-center">
					<div className="mx-auto max-w-md">
						<div className="mb-4 text-6xl">😵</div>
						<h2 className="mb-2 text-xl font-semibold text-red-600">
							Oops! Something went wrong
						</h2>
						<p className="mb-4 text-gray-600">
							{this.state.error?.message || 'An unexpected error occurred'}
						</p>
						<button
							onClick={() => this.setState({ hasError: false, error: null })}
							className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
						>
							Try Again
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
