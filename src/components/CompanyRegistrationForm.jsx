import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'
import {
  ApiError,
  registerCompany,
  sendCompanyVerificationCode,
  verifyCompanyEmailCode,
} from '../Services/companyRegistrationApi'
import { navigateTo, routes } from '../utils/routes'

const initialFormData = {
  email: '',
  verificationCode: '',
  adminUsername: '',
  adminPassword: '',
  companyUserUsername: '',
  companyUserPassword: '',
  companyName: '',
  ownerFirstName: '',
  ownerLastName: '',
  phone: '',
  address: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const namePattern = /^[\p{L}\s'-]{2,50}$/u
const phonePattern = /^[+0-9\s-]{8,25}$/
const usernamePattern = /^[A-Za-z0-9._-]{3,50}$/
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/
const verificationCodeLength = 6

const fieldGroups = {
  1: ['email'],
  2: ['adminUsername', 'adminPassword', 'companyUserUsername', 'companyUserPassword'],
  3: ['companyName', 'ownerFirstName', 'ownerLastName', 'phone', 'address'],
  4: ['whatsapp', 'instagram', 'facebook'],
}

function sanitizeSocialValue(value) {
  return value.trim().replace(/^@+/, '')
}

function sanitizePhoneValue(value) {
  return value.replace(/[^\d+ -]/g, '')
}

function sanitizeDigits(value) {
  return value.replace(/\D/g, '')
}

function normalizeEmailValue(value) {
  return value.trim().toLowerCase()
}

function inputClasses(error) {
  return `rounded-2xl border px-4 py-3 outline-none transition ${
    error ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white focus:border-sky-400'
  }`
}

function getFieldError(name, value, formData) {
  const trimmedValue = value.trim()

  if (name === 'email') {
    return emailPattern.test(trimmedValue) ? '' : 'Ingresa un correo valido para continuar.'
  }

  if (name === 'adminUsername' || name === 'companyUserUsername') {
    if (!usernamePattern.test(trimmedValue)) {
      return 'Usa entre 3 y 50 caracteres con letras, numeros, punto, guion o guion bajo.'
    }

    if (
      formData.adminUsername.trim() &&
      formData.companyUserUsername.trim() &&
      formData.adminUsername.trim().toLowerCase() === formData.companyUserUsername.trim().toLowerCase()
    ) {
      return name === 'adminUsername'
        ? 'Debe ser distinto del usuario operativo.'
        : 'Debe ser distinto del usuario administrador.'
    }

    return ''
  }

  if (name === 'adminPassword' || name === 'companyUserPassword') {
    return passwordPattern.test(value)
      ? ''
      : 'Usa entre 8 y 64 caracteres, con al menos una letra, un numero y un caracter especial.'
  }

  if (name === 'companyName') {
    return trimmedValue.length >= 2 && trimmedValue.length <= 50
      ? ''
      : 'Ingresa el nombre de la empresa entre 2 y 50 caracteres.'
  }

  if (name === 'ownerFirstName' || name === 'ownerLastName') {
    return namePattern.test(trimmedValue) ? '' : 'Ingresa un dato valido.'
  }

  if (name === 'phone') {
    return phonePattern.test(trimmedValue) ? '' : 'Ingresa un telefono valido.'
  }

  if (name === 'address') {
    return trimmedValue.length >= 3 && trimmedValue.length <= 50
      ? ''
      : 'Ingresa una direccion entre 3 y 50 caracteres.'
  }

  if (name === 'whatsapp') {
    const digits = sanitizeDigits(value)
    return !trimmedValue || (digits.length >= 8 && digits.length <= 15)
      ? ''
      : 'Ingresa un WhatsApp valido de 8 a 15 digitos.'
  }

  if (name === 'instagram' || name === 'facebook') {
    return trimmedValue.length <= 60 ? '' : 'Este campo admite hasta 60 caracteres.'
  }

  return ''
}

function buildStepErrors(formData, step) {
  return fieldGroups[step].reduce((errors, fieldName) => {
    const error = getFieldError(fieldName, formData[fieldName], formData)
    if (error) {
      errors[fieldName] = error
    }
    return errors
  }, {})
}

function StatusAlert({ type, message }) {
  if (!message) {
    return null
  }

  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    error: 'border-rose-200 bg-rose-50 text-rose-700',
    info: 'border-sky-200 bg-sky-50 text-sky-700',
  }

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[type]}`}>{message}</div>
}

StatusAlert.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'info']).isRequired,
  message: PropTypes.string,
}

export default function CompanyRegistrationForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [fieldErrors, setFieldErrors] = useState({})
  const [status, setStatus] = useState({ type: 'info', message: '' })
  const [verificationToken, setVerificationToken] = useState('')
  const [verificationEmail, setVerificationEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [emailVerificationValidUntil, setEmailVerificationValidUntil] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completedRegistration, setCompletedRegistration] = useState(null)
  const [resendCooldown, setResendCooldown] = useState(0)
  const verificationCodeRefs = useRef([])
  const normalizedCurrentEmail = normalizeEmailValue(formData.email)
  const verificationCodeDigits = sanitizeDigits(formData.verificationCode)
  const hasCompleteVerificationCode = verificationCodeDigits.length === verificationCodeLength
  const hasActiveVerificationEmail = verificationEmail.length > 0
  const isCurrentEmailDifferentFromVerification =
    hasActiveVerificationEmail && normalizedCurrentEmail !== verificationEmail
  const verificationValidUntilTimestamp = emailVerificationValidUntil
    ? Date.parse(emailVerificationValidUntil)
    : Number.NaN
  const isEmailVerificationExpired =
    emailVerified &&
    !Number.isNaN(verificationValidUntilTimestamp) &&
    verificationValidUntilTimestamp <= Date.now()
  const hasCodeForCurrentEmail =
    emailSent && !isCurrentEmailDifferentFromVerification
  const isCurrentEmailVerified =
    emailVerified && !isCurrentEmailDifferentFromVerification && !isEmailVerificationExpired
  const whatsappDigits = sanitizeDigits(formData.whatsapp)
  const instagramHandle = sanitizeSocialValue(formData.instagram)
  const facebookHandle = sanitizeSocialValue(formData.facebook)
  const whatsappPreviewUrl = whatsappDigits ? `https://wa.me/${whatsappDigits}` : ''
  const instagramPreviewUrl = instagramHandle
    ? `https://www.instagram.com/${instagramHandle}/`
    : ''
  const facebookPreviewUrl = facebookHandle
    ? `https://www.facebook.com/${facebookHandle}/`
    : ''

  useEffect(() => {
    if (resendCooldown <= 0) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setResendCooldown((currentValue) => currentValue - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [resendCooldown])

  useEffect(() => {
    if (!emailVerified || !emailVerificationValidUntil) {
      return undefined
    }

    if (Number.isNaN(verificationValidUntilTimestamp)) {
      return undefined
    }

    const remainingMilliseconds = verificationValidUntilTimestamp - Date.now()
    if (remainingMilliseconds <= 0) {
      setEmailVerified(false)
      setEmailSent(false)
      setEmailVerificationValidUntil('')
      setFormData((currentValue) => ({ ...currentValue, verificationCode: '' }))
      setStatus({
        type: 'info',
        message: 'La validacion del correo vencio. Solicita un nuevo codigo para continuar.',
      })
      return undefined
    }

    const expirationTimer = window.setTimeout(() => {
      setEmailVerified(false)
      setEmailSent(false)
      setEmailVerificationValidUntil('')
      setFormData((currentValue) => ({ ...currentValue, verificationCode: '' }))
      setStatus({
        type: 'info',
        message: 'La validacion del correo vencio. Solicita un nuevo codigo para continuar.',
      })
    }, remainingMilliseconds)

    return () => window.clearTimeout(expirationTimer)
  }, [emailVerified, emailVerificationValidUntil, verificationValidUntilTimestamp])

  const updateField = (name, nextValue) => {
    const nextFormData = { ...formData, [name]: nextValue }
    setFormData(nextFormData)
    setFieldErrors((currentValue) => {
      const nextErrors = { ...currentValue }
      const fieldsToUpdate =
        name === 'adminUsername' || name === 'companyUserUsername'
          ? ['adminUsername', 'companyUserUsername']
          : [name]

      fieldsToUpdate.forEach((fieldName) => {
        if (!currentValue[fieldName] && fieldName !== name) {
          return
        }

        const error = getFieldError(fieldName, nextFormData[fieldName], nextFormData)
        if (error) {
          nextErrors[fieldName] = error
        } else {
          delete nextErrors[fieldName]
        }
      })

      return nextErrors
    })
  }

  const applyVerificationCodeDigits = (rawValue, startIndex = 0) => {
    const digitsToApply = sanitizeDigits(rawValue).slice(
      0,
      verificationCodeLength - startIndex
    )

    if (!digitsToApply) {
      return startIndex
    }

    const currentDigits = formData.verificationCode
      .padEnd(verificationCodeLength, ' ')
      .split('')

    digitsToApply.split('').forEach((digit, offset) => {
      currentDigits[startIndex + offset] = digit
    })

    const nextCode = currentDigits.join('').trimEnd()
    setFormData((currentValue) => ({
      ...currentValue,
      verificationCode: nextCode,
    }))

    return Math.min(
      startIndex + digitsToApply.length,
      verificationCodeLength - 1
    )
  }

  const getVerificationCodeSlotValue = (index) => {
    const slotValue = formData.verificationCode[index]
    return slotValue && slotValue !== ' ' ? slotValue : ''
  }

  const handleFieldChange = ({ target: { name, value } }) => {
    if (name === 'email') {
      setStatus((currentValue) =>
        currentValue.message ? { type: 'info', message: '' } : currentValue
      )
      updateField(name, value)
      return
    }

    if (name === 'instagram' || name === 'facebook') {
      updateField(name, sanitizeSocialValue(value))
      return
    }

    if (name === 'phone' || name === 'whatsapp') {
      updateField(name, sanitizePhoneValue(value))
      return
    }

    updateField(name, value)
  }

  const validateStep = (targetStep) => {
    const nextErrors = buildStepErrors(formData, targetStep)
    setFieldErrors((currentValue) => ({ ...currentValue, ...nextErrors }))
    return Object.keys(nextErrors).length === 0
  }

  const requireActiveEmailVerification = () => {
    if (isCurrentEmailVerified) {
      return true
    }

    setEmailVerified(false)
    setEmailSent(false)
    setEmailVerificationValidUntil('')
    setFormData((currentValue) => ({ ...currentValue, verificationCode: '' }))
    setStep(1)
    setStatus({
      type: 'error',
      message: isEmailVerificationExpired
        ? 'La validacion del correo vencio. Solicita un nuevo codigo para continuar.'
        : 'Primero debes validar el correo del responsable para continuar.',
    })
    return false
  }

  const goToStep = (targetStep, message) => {
    if (targetStep > 2 && !requireActiveEmailVerification()) {
      return
    }

    if (!validateStep(targetStep - 1)) {
      setStatus({ type: 'error', message })
      return
    }

    setStatus({ type: 'info', message: '' })
    setStep(targetStep)
  }

  const handleVerificationCodeInput = ({ target: { value } }, index) => {
    const nextDigits = sanitizeDigits(value)

    if (nextDigits.length > 1) {
      const focusIndex = applyVerificationCodeDigits(nextDigits, index)
      verificationCodeRefs.current[focusIndex]?.focus()
      return
    }

    const digit = nextDigits.slice(-1)
    const digits = formData.verificationCode.padEnd(verificationCodeLength, ' ').split('')
    digits[index] = digit || ' '
    const nextCode = digits.join('').trimEnd()

    setFormData((currentValue) => ({ ...currentValue, verificationCode: nextCode }))

    if (digit && index < verificationCodeLength - 1) {
      verificationCodeRefs.current[index + 1]?.focus()
    }
  }

  const handleVerificationCodePaste = (event, index) => {
    const pastedDigits = sanitizeDigits(event.clipboardData.getData('text'))

    if (!pastedDigits) {
      return
    }

    event.preventDefault()
    const focusIndex = applyVerificationCodeDigits(pastedDigits, index)
    verificationCodeRefs.current[focusIndex]?.focus()
  }

  const handleVerificationCodeKeyDown = (event, index) => {
    if (
      event.key === 'Backspace' &&
      !getVerificationCodeSlotValue(index) &&
      index > 0
    ) {
      verificationCodeRefs.current[index - 1]?.focus()
    }
  }

  const handleSendVerificationCode = async ({
    isResend = false,
    forceResend = false,
  } = {}) => {
    if (resendCooldown > 0) {
      setStatus({
        type: 'info',
        message: `Espera ${resendCooldown} segundos antes de solicitar un nuevo codigo.`,
      })
      return
    }

    if (!validateStep(1)) {
      setStatus({ type: 'error', message: 'Revisa el correo antes de continuar.' })
      return
    }

    setSubmitting(true)
    setStatus({ type: 'info', message: '' })

    try {
      const response = await sendCompanyVerificationCode({
        email: formData.email,
        forceResend,
      })
      setVerificationToken(response.verificationToken)
      setVerificationEmail(normalizedCurrentEmail)
      setEmailVerificationValidUntil(response.verificationValidUntilUtc ?? '')

      if (response.alreadyVerified) {
        setEmailVerified(true)
        setEmailSent(true)
        setStep(2)
        setStatus({
          type: 'success',
          message:
            'Ese correo ya estaba validado y puedes continuar con el alta durante las proximas horas.',
        })
        return
      }

      setFormData((currentValue) => ({
        ...currentValue,
        verificationCode: '',
      }))
      setEmailVerified(false)
      setEmailSent(true)
      setEmailVerificationValidUntil('')
      setResendCooldown(60)

      setStatus({
        type: 'success',
        message: isResend
          ? 'Te enviamos un nuevo codigo de validacion.'
          : 'Te enviamos un codigo de validacion al correo indicado.',
      })

      window.setTimeout(() => {
        verificationCodeRefs.current[0]?.focus()
      }, 120)
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof ApiError
            ? error.message
            : 'No pudimos enviar el codigo de validacion.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyEmailCode = async () => {
    if (isCurrentEmailDifferentFromVerification) {
      setStatus({
        type: 'error',
        message:
          'El codigo vigente fue enviado a otro correo. Envia un nuevo codigo al correo actual para continuar.',
      })
      return
    }

    if (!hasCompleteVerificationCode) {
      setStatus({ type: 'error', message: 'El codigo debe tener 6 digitos.' })
      return
    }

    setSubmitting(true)
    setStatus({ type: 'info', message: '' })

    try {
      const response = await verifyCompanyEmailCode({
        verificationToken,
        code: verificationCodeDigits,
      })
      setEmailVerified(true)
      setEmailVerificationValidUntil(response.verificationValidUntilUtc)
      setStep(2)
      setStatus({
        type: 'success',
        message:
          'Correo validado correctamente. Esta validacion seguira activa durante las proximas horas. Ahora crea el usuario administrador y el usuario operativo.',
      })
    } catch (error) {
      if (error instanceof ApiError && error.payload?.code === 'verification_expired') {
        setEmailVerified(false)
        setEmailSent(false)
        setEmailVerificationValidUntil('')
        setFormData((currentValue) => ({ ...currentValue, verificationCode: '' }))
      }

      setStatus({
        type: 'error',
        message:
          error instanceof ApiError ? error.message : 'No pudimos verificar el codigo.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleFinalSubmit = async (event) => {
    event.preventDefault()

    if (!requireActiveEmailVerification()) {
      return
    }

    const isAccessValid = validateStep(2)
    const isCompanyValid = validateStep(3)
    const isChannelsValid = validateStep(4)
    if (!isAccessValid || !isCompanyValid || !isChannelsValid) {
      setStatus({ type: 'error', message: 'Hay campos pendientes o invalidos.' })
      return
    }

    setSubmitting(true)
    setStatus({ type: 'info', message: '' })

    try {
      const response = await registerCompany({
        verificationToken,
        adminUsername: formData.adminUsername,
        adminPassword: formData.adminPassword,
        companyUserUsername: formData.companyUserUsername,
        companyUserPassword: formData.companyUserPassword,
        companyName: formData.companyName,
        ownerFirstName: formData.ownerFirstName,
        ownerLastName: formData.ownerLastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        whatsapp: formData.whatsapp,
        instagram: formData.instagram,
        facebook: formData.facebook,
      })

      setCompletedRegistration(response)
      setStatus({
        type: 'success',
        message:
          'La empresa fue registrada correctamente con sus accesos iniciales y configuracion base.',
      })
    } catch (error) {
      if (error instanceof ApiError && error.payload?.code === 'email_verification_expired') {
        setEmailVerified(false)
        setEmailSent(false)
        setEmailVerificationValidUntil('')
        setFormData((currentValue) => ({ ...currentValue, verificationCode: '' }))
        setStep(1)
      }

      setStatus({
        type: 'error',
        message:
          error instanceof ApiError
            ? error.message
            : 'No pudimos completar el registro de la empresa.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderStepBadge = (stepNumber, label) => {
    const isActive = step === stepNumber
    const isCompleted = step > stepNumber || (stepNumber === 1 && emailVerified)

    return (
      <div
        key={label}
        className={`flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 ${
          isActive ? 'step-ring bg-sky-50' : 'bg-slate-50'
        }`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
            isCompleted
              ? 'bg-emerald-400 text-slate-950'
              : isActive
                ? 'bg-slate-950 text-white'
                : 'bg-white text-slate-500'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Paso {stepNumber}</p>
          <p className="text-sm font-semibold text-slate-800">{label}</p>
        </div>
      </div>
    )
  }

  const renderField = ({
    name,
    label,
    placeholder,
    type = 'text',
    autoComplete,
    className = '',
    helperContent = null,
  }) => (
    <label className={`grid gap-2 text-sm font-medium text-slate-700 ${className}`}>
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        value={formData[name]}
        onChange={handleFieldChange}
        placeholder={placeholder}
        className={inputClasses(fieldErrors[name])}
      />
      {fieldErrors[name] && (
        <span className="text-sm font-normal text-rose-600">{fieldErrors[name]}</span>
      )}
      {helperContent}
    </label>
  )

  if (completedRegistration) {
    return (
      <section className="section-shell rounded-[2rem] p-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-3xl font-semibold text-slate-950">Tu empresa ya esta creada</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Ya dejamos registrada tu empresa en Fidebill con el identificador interno
            <span className="mx-1 font-semibold text-slate-950">
              #{completedRegistration.companyId}
            </span>
            .
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-500">
            Tambien quedaron creados el usuario administrador
            <span className="mx-1 font-semibold text-slate-950">
              {completedRegistration.adminUsername}
            </span>
            y el usuario operativo
            <span className="mx-1 font-semibold text-slate-950">
              {completedRegistration.companyUserUsername}
            </span>
            .
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigateTo(routes.home)}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Volver a la landing
            </button>
            <a
              href="https://wa.me/5492235484897"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Coordinar activacion
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-shell rounded-[2rem] p-8 shadow-xl shadow-slate-950/5">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">
            Formulario por pasos
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950">
            Completa el alta guiada de tu empresa
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Primero validamos el correo del responsable. Despues te pedimos los
            accesos iniciales y los datos minimos para dejar la empresa creada.
          </p>
        </div>

        <div className="grid gap-3 xl:grid-cols-4">
          {[
            renderStepBadge(1, 'Verificar correo'),
            renderStepBadge(2, 'Crear usuarios'),
            renderStepBadge(3, 'Datos de empresa'),
            renderStepBadge(4, 'Canales'),
          ]}
        </div>

        <StatusAlert type={status.type} message={status.message} />

        {step === 1 && (
          <div className="grid gap-6">
            <label className="grid gap-2 text-sm font-medium text-slate-700" htmlFor="email">
              Correo del responsable
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFieldChange}
                placeholder="empresa@dominio.com"
                className={`w-full ${inputClasses(fieldErrors.email)}`}
              />
              {fieldErrors.email && (
                <span className="text-sm font-normal text-rose-600">{fieldErrors.email}</span>
              )}
            </label>

            {hasActiveVerificationEmail && isCurrentEmailDifferentFromVerification && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
                <p className="text-sm font-semibold text-amber-900">
                  El codigo vigente fue enviado a {verificationEmail}
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  Cambiaste el correo en el formulario. Si quieres continuar con
                  <strong> {formData.email || ' el correo actual'}</strong>, envia un nuevo
                  codigo. Si no, puedes volver a usar el correo anterior.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleSendVerificationCode({ isResend: true, forceResend: true })}
                    disabled={submitting || resendCooldown > 0}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {resendCooldown > 0
                      ? `Reenviar en ${resendCooldown}s`
                      : 'Enviar codigo al correo actual'}
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField('email', verificationEmail)}
                    className="rounded-full border border-amber-300 px-5 py-3 text-sm font-semibold text-amber-900 transition hover:border-amber-400"
                  >
                    Volver al correo anterior
                  </button>
                </div>
              </div>
            )}

            {!hasCodeForCurrentEmail &&
              !isCurrentEmailVerified &&
              (!hasActiveVerificationEmail || !isCurrentEmailDifferentFromVerification) && (
              <button
                type="button"
                onClick={() => handleSendVerificationCode()}
                disabled={submitting || resendCooldown > 0}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {resendCooldown > 0
                  ? `Reenviar en ${resendCooldown}s`
                  : 'Enviar codigo de validacion'}
              </button>
            )}

            {hasCodeForCurrentEmail && !isCurrentEmailVerified && (
              <>
                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4">
                  <p className="text-sm font-semibold text-sky-900">
                    Codigo enviado a {verificationEmail}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-sky-800">
                    Usa el codigo que recibiste en ese correo para continuar con el alta.
                  </p>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    Codigo de validacion
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          verificationCodeRefs.current[index] = element
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="code-slot"
                        value={getVerificationCodeSlotValue(index)}
                        onChange={(event) => handleVerificationCodeInput(event, index)}
                        onPaste={(event) => handleVerificationCodePaste(event, index)}
                        onKeyDown={(event) => handleVerificationCodeKeyDown(event, index)}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    Puedes pegar el codigo completo. Revisa tambien Spam, Correo no
                    deseado o Promociones.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => handleSendVerificationCode({ isResend: true })}
                    disabled={submitting || resendCooldown > 0}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar codigo'}
                  </button>

                  <button
                    type="button"
                    onClick={handleVerifyEmailCode}
                    disabled={submitting || !hasCompleteVerificationCode}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Validar correo
                  </button>
                </div>
              </>
            )}

            {isCurrentEmailVerified && (
              <div className="grid gap-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                  <p className="text-sm font-semibold text-emerald-800">
                    Correo validado correctamente
                  </p>
                  <p className="mt-2 text-sm leading-6 text-emerald-700">
                    Ya puedes continuar con el alta. El correo validado es
                    <strong> {verificationEmail}</strong>. Si necesitas volver a validarlo,
                    puedes solicitar un nuevo codigo desde aqui. Esta validacion dura
                    unas horas y, si vence, te pediremos confirmarla otra vez.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      handleSendVerificationCode({ isResend: true, forceResend: true })
                    }
                    disabled={submitting || resendCooldown > 0}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resendCooldown > 0
                      ? `Reenviar en ${resendCooldown}s`
                      : 'Enviar un nuevo codigo'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                  >
                    Continuar con el alta
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">Accesos iniciales</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Crea un usuario administrador para la configuracion general y un
                usuario operativo para el uso diario. Te recomendamos guardarlos en
                un lugar seguro.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="grid gap-4 rounded-[1.75rem] border border-sky-200 bg-sky-50/80 p-5">
                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                    Perfil administrador
                  </p>
                  <p className="text-base font-semibold text-slate-950">
                    Controla la configuracion general
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    Este acceso es para quien gestione la cuenta, los ajustes y la
                    administracion principal.
                  </p>
                </div>

                {renderField({
                  name: 'adminUsername',
                  label: 'Usuario del administrador',
                  placeholder: 'fidebill_admin',
                  autoComplete: 'username',
                })}
                {renderField({
                  name: 'adminPassword',
                  label: 'Clave del administrador',
                  placeholder: '8+ caracteres con letra, numero y simbolo',
                  type: 'password',
                  autoComplete: 'new-password',
                })}

                <p className="rounded-2xl border border-sky-200 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-600">
                  Recomendado para el titular o para quien vaya a administrar la
                  configuracion de la empresa.
                </p>
              </div>

              <div className="grid gap-4 rounded-[1.75rem] border border-emerald-200 bg-emerald-50/80 p-5">
                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Perfil operativo
                  </p>
                  <p className="text-base font-semibold text-slate-950">
                    Usalo para la operacion diaria
                  </p>
                  <p className="text-sm leading-6 text-slate-600">
                    Este acceso es para caja, mostrador o el equipo que usara la
                    plataforma todos los dias.
                  </p>
                </div>

                {renderField({
                  name: 'companyUserUsername',
                  label: 'Usuario operativo',
                  placeholder: 'fidebill_guemes',
                  autoComplete: 'username',
                })}
                {renderField({
                  name: 'companyUserPassword',
                  label: 'Clave del usuario operativo',
                  placeholder: '8+ caracteres con letra, numero y simbolo',
                  type: 'password',
                  autoComplete: 'new-password',
                })}

                <p className="rounded-2xl border border-emerald-200 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-600">
                  Debe ser distinto del administrador para separar permisos y
                  responsabilidades.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>

              <button
                type="button"
                onClick={() =>
                  goToStep(3, 'Revisa los accesos iniciales antes de continuar.')
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              {renderField({
                name: 'companyName',
                label: 'Nombre de la empresa',
                placeholder: 'fidebill',
              })}
              {renderField({
                name: 'phone',
                label: 'Telefono del titular',
                placeholder: '+54 9 223 548 4897',
              })}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {renderField({
                name: 'ownerFirstName',
                label: 'Nombre del titular',
                placeholder: 'Federico',
              })}
              {renderField({
                name: 'ownerLastName',
                label: 'Apellido del titular',
                placeholder: 'Ramos',
              })}
            </div>

            {renderField({
              name: 'address',
              label: 'Direccion de la central',
              placeholder: 'Güemes 1500',
            })}

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>

              <button
                type="button"
                onClick={() =>
                  goToStep(4, 'Completa los datos obligatorios de la empresa para continuar.')
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        {step === 4 && (
          <form className="grid gap-5" onSubmit={handleFinalSubmit}>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">Canales opcionales</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Puedes completar solo los perfiles que ya tengas disponibles. Si lo
                prefieres, puedes finalizar el alta sin cargar ningun canal.
              </p>
            </div>

            <div className="grid gap-5">
              {renderField({
                name: 'whatsapp',
                label: 'WhatsApp (opcional)',
                placeholder: '5492235484897',
                helperContent: whatsappPreviewUrl ? (
                  <a
                    href={whatsappPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                  >
                    Probar WhatsApp
                  </a>
                ) : (
                  <span className="text-sm font-normal text-slate-500">
                    Carga un numero para probar el enlace antes de finalizar.
                  </span>
                ),
              })}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {renderField({
                name: 'instagram',
                label: 'Instagram (opcional)',
                placeholder: 'fidebillsoftware',
                helperContent: instagramPreviewUrl ? (
                  <a
                    href={instagramPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                  >
                    Probar Instagram
                  </a>
                ) : (
                  <span className="text-sm font-normal text-slate-500">
                    Escribe el usuario para abrir el perfil y validarlo.
                  </span>
                ),
              })}
              {renderField({
                name: 'facebook',
                label: 'Facebook (opcional)',
                placeholder: 'fidebill.soft',
                helperContent: facebookPreviewUrl ? (
                  <a
                    href={facebookPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-fit items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                  >
                    Probar Facebook
                  </a>
                ) : (
                  <span className="text-sm font-normal text-slate-500">
                    Escribe el identificador para revisar que el enlace sea correcto.
                  </span>
                ),
              })}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">Resumen del alta</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Vamos a registrar a <strong>{formData.companyName || 'tu empresa'}</strong> con
                el correo <strong>{formData.email}</strong> y los usuarios
                <strong> {formData.adminUsername || 'admin'}</strong> y
                <strong> {formData.companyUserUsername || 'operativo'}</strong>. Ademas
                vamos a dejar creada la configuracion inicial para que puedas avanzar
                con la activacion.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Finalizar registro
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
