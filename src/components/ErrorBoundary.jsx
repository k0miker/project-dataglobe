import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Fehlerprotokollierung z.B. an einen Logging-Service senden
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h1>Ein Fehler ist aufgetreten.</h1>
          <p>Bitte versuchen Sie es später erneut.</p>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
