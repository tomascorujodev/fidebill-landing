const defaultApiBaseUrl = 'http://localhost:5077'

const apiBaseUrl = (
  import.meta.env.VITE_COMPANY_REGISTRATION_API_URL || defaultApiBaseUrl
).replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const responseBody = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = typeof responseBody === 'string'
      ? responseBody
      : responseBody.message || 'No pudimos completar la operacion.'

    throw new ApiError(message, response.status, responseBody)
  }

  return responseBody
}

export function sendCompanyVerificationCode({ email, forceResend = false }) {
  return apiRequest('/api/company-registration/email/send-code', {
    method: 'POST',
    body: JSON.stringify({ email, forceResend }),
  })
}

export function verifyCompanyEmailCode(payload) {
  return apiRequest('/api/company-registration/email/verify-code', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function registerCompany(payload) {
  return apiRequest('/api/company-registration', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
