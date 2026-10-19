import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { SettingsProvider } from "./context/SettingsContext";
import { Header } from "./components/Header";
import { Toast } from "./components/Toast";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { HomePage } from "./pages/HomePage";
import { CartPage } from "./pages/CartPage";
import { SignInPage } from "./pages/SignInPage";
import { ProfileSetupPage } from "./pages/ProfileSetupPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { OrdersHistoryPage } from "./pages/OrdersHistoryPage";
import { StoresPage } from "./pages/StoresPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SupportPage } from "./pages/SupportPage";
import { LocationsListPage } from "./pages/admin/LocationsListPage";
import { LocationFormPage } from "./pages/admin/LocationFormPage";
import { AreasListPage } from "./pages/admin/AreasListPage";
import { AreaFormPage } from "./pages/admin/AreaFormPage";
import { ShopsListPage } from "./pages/admin/ShopsListPage";
import { ShopFormPage } from "./pages/admin/ShopFormPage";

import { FloatingPillNav } from "./components/FloatingPillNav";
import { AiAssistantModal } from "./components/AiAssistantModal";

export const App: React.FC = () => {
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <SettingsProvider>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
              <Header />

              <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Routes>
                  {/* Home Page: starts with the clean centered logo landing viewport, followed by stores and catalog */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/stores" element={<StoresPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileSetupPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-confirmation/:orderId"
                    element={<OrderConfirmationPage />}
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <OrdersHistoryPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Super Admin Routes (restricted to business.dumdum@gmail.com) ── */}
                  <Route
                    path="/admin/locations"
                    element={
                      <ProtectedRoute requireAdmin>
                        <LocationsListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/locations/new"
                    element={
                      <ProtectedRoute requireAdmin>
                        <LocationFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/locations/edit/:id"
                    element={
                      <ProtectedRoute requireAdmin>
                        <LocationFormPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/areas"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AreasListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/areas/new"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AreaFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/areas/edit/:id"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AreaFormPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/shops"
                    element={
                      <ProtectedRoute requireAdmin>
                        <ShopsListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/shops/new"
                    element={
                      <ProtectedRoute requireAdmin>
                        <ShopFormPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/shops/edit/:id"
                    element={
                      <ProtectedRoute requireAdmin>
                        <ShopFormPage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Fallback route */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </main>

              {/* Floating Navigation Dock (from EcomInventory UI) */}
              <FloatingPillNav onOpenAiModal={() => setIsAiModalOpen(true)} />

              {/* App-level AI Assistant Modal */}
              <AiAssistantModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
              />

              <Toast />
            </div>
          </SettingsProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
