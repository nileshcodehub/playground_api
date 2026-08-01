export const simulationMiddleware = async (req, res, next) => {
  try {
    // 1. Extract Delay Simulation Parameter (Header or Query)
    const rawDelay = req.headers['x-simulate-delay'] || req.query._delay;
    if (rawDelay !== undefined && rawDelay !== null && rawDelay !== '') {
      const parsedDelay = parseInt(rawDelay, 10);
      if (!isNaN(parsedDelay) && parsedDelay > 0) {
        // Clamp delay between 0 and 20,000 ms (20 seconds max)
        const delayMs = Math.min(20000, Math.max(0, parsedDelay));
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    // 2. Extract Error Status Simulation Parameter (Header or Query)
    const rawStatus = req.headers['x-simulate-status'] || req.query._status;
    if (rawStatus !== undefined && rawStatus !== null && rawStatus !== '') {
      const statusCode = parseInt(rawStatus, 10);
      if (!isNaN(statusCode) && statusCode >= 400 && statusCode <= 599) {
        return res.status(statusCode).json({
          error: {
            message: `Simulated error status ${statusCode} via X-Simulate-Status / ?_status`,
            status: statusCode
          }
        });
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
