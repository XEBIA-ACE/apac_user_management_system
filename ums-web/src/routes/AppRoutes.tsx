import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from '../auth/RequireAuth';
import { PostAuthLayout } from '../layouts/PostAuthLayout';
import { PreAuthLayout } from '../layouts/PreAuthLayout';
import {
  AccountDeletionConfirmationScreen,
  DashboardScreen,
  DeletionRollbackErrorScreen,
  LoginScreen,
  OtpRecoveryHubScreen,
  OtpVerificationScreen,
  OtpVerificationSuccessScreen,
  PostDeletionConfirmationScreen,
  ProfileScreen,
  RegistrationScreen,
  SessionReauthScreen,
} from '../screens';
import { ROUTES } from './paths';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PreAuthLayout />}>
        <Route path={ROUTES.register} element={<RegistrationScreen />} />
        <Route path={ROUTES.verifyOtp} element={<OtpVerificationScreen />} />
        <Route path={ROUTES.verifyOtpSuccess} element={<OtpVerificationSuccessScreen />} />
        <Route path={ROUTES.otpRecovery} element={<OtpRecoveryHubScreen />} />
        <Route path={ROUTES.login} element={<LoginScreen />} />
        <Route path={ROUTES.sessionReauth} element={<SessionReauthScreen />} />
        <Route path={ROUTES.accountDeleted} element={<PostDeletionConfirmationScreen />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<PostAuthLayout />}>
          <Route path={ROUTES.dashboard} element={<DashboardScreen />} />
          <Route path={ROUTES.profile} element={<ProfileScreen />} />
          <Route path={ROUTES.deleteAccount} element={<AccountDeletionConfirmationScreen />} />
          <Route path={ROUTES.deleteAccountError} element={<DeletionRollbackErrorScreen />} />
        </Route>
      </Route>
      <Route path={ROUTES.root} element={<Navigate to={ROUTES.login} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.login} replace />} />
    </Routes>
  );
}
