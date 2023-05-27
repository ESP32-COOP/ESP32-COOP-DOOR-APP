export function betterTimeDisplay(deltaTime: number) {
    const seconds = Math.abs(Math.floor(deltaTime / 1000)); // Convert deltaTime to seconds
    const sign =  Math.floor(deltaTime / 1000) >= 0 ? '' : '-'; // Determine the sign

    switch (true) {
      case seconds < 60:
        return sign + seconds + ' seconds';
      case seconds < 3600:
        const minutes = Math.floor(seconds / 60);
        return sign + minutes + ' minutes';
      case seconds < 86400:
        const hours = Math.floor(seconds / 3600);
        return sign + hours + ' hours';
      case seconds < 2592000:
        const days = Math.floor(seconds / 86400);
        return sign + days + ' days';
      case seconds < 31536000:
        const months = Math.floor(seconds / 2592000);
        return sign + months + ' months';
      default:
        const years = Math.floor(seconds / 31536000);
        return sign + years + ' years';
    } 
  }
  