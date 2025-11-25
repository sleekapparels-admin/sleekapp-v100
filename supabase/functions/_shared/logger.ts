/**
 * Structured logging utility with PII sanitization
 * Ensures sensitive data is redacted from logs while maintaining debuggability
 */

interface LogData {
  [key: string]: any;
}

/**
 * Sanitizes email addresses to show only first 3 chars and domain
 * Example: john.doe@example.com -> joh***@example.com
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '[invalid-email]';
  
  const parts = email.split('@');
  if (parts.length !== 2) return '[invalid-email]';
  
  const [local, domain] = parts;
  const sanitizedLocal = local.length > 3 
    ? local.substring(0, 3) + '***'
    : '***';
  
  return `${sanitizedLocal}@${domain}`;
}

/**
 * Sanitizes phone numbers to show only first 4 and last 2 digits
 * Example: +8801234567890 -> +880****90
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '[invalid-phone]';
  
  // Remove all non-numeric characters except leading +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  if (cleaned.length < 6) return '***';
  
  const prefix = cleaned.substring(0, 4);
  const suffix = cleaned.substring(cleaned.length - 2);
  
  return `${prefix}****${suffix}`;
}

/**
 * Sanitizes order IDs to show only first 8 characters
 * Example: 550e8400-e29b-41d4-a716-446655440000 -> 550e8400-****
 */
export function sanitizeOrderId(orderId: string): string {
  if (!orderId || typeof orderId !== 'string') return '[invalid-id]';
  
  return orderId.length > 8 
    ? orderId.substring(0, 8) + '-****'
    : orderId;
}

/**
 * Automatically sanitizes known PII fields in log data
 */
function sanitizeLogData(data: LogData): LogData {
  const sanitized: LogData = {};
  
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    
    if (lowerKey.includes('email')) {
      sanitized[key] = typeof value === 'string' ? sanitizeEmail(value) : value;
    } else if (lowerKey.includes('phone')) {
      sanitized[key] = typeof value === 'string' ? sanitizePhone(value) : value;
    } else if (lowerKey.includes('orderid') || lowerKey.includes('order_id')) {
      sanitized[key] = typeof value === 'string' ? sanitizeOrderId(value) : value;
    } else if (lowerKey.includes('password') || lowerKey.includes('token') || lowerKey.includes('secret')) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Formats timestamp in ISO format with timezone
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Logger class with structured logging and PII sanitization
 */
export class Logger {
  private context: string;
  
  constructor(context: string = 'edge-function') {
    this.context = context;
  }
  
  /**
   * Info level logging for general operational messages
   */
  info(message: string, data?: LogData): void {
    const sanitizedData = data ? sanitizeLogData(data) : {};
    console.log(
      JSON.stringify({
        level: 'INFO',
        timestamp: getTimestamp(),
        context: this.context,
        message,
        ...sanitizedData
      })
    );
  }
  
  /**
   * Warning level logging for recoverable issues
   */
  warn(message: string, data?: LogData): void {
    const sanitizedData = data ? sanitizeLogData(data) : {};
    console.warn(
      JSON.stringify({
        level: 'WARN',
        timestamp: getTimestamp(),
        context: this.context,
        message,
        ...sanitizedData
      })
    );
  }
  
  /**
   * Error level logging for failures and exceptions
   */
  error(message: string, error?: any, data?: LogData): void {
    const sanitizedData = data ? sanitizeLogData(data) : {};
    console.error(
      JSON.stringify({
        level: 'ERROR',
        timestamp: getTimestamp(),
        context: this.context,
        message,
        error: error?.message || error,
        stack: error?.stack,
        ...sanitizedData
      })
    );
  }
  
  /**
   * Success level logging for completed operations
   */
  success(message: string, data?: LogData): void {
    const sanitizedData = data ? sanitizeLogData(data) : {};
    console.log(
      JSON.stringify({
        level: 'SUCCESS',
        timestamp: getTimestamp(),
        context: this.context,
        message,
        ...sanitizedData
      })
    );
  }
}

/**
 * Creates a logger instance for a specific context
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}
