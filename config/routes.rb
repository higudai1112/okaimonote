Rails.application.routes.draw do
  root to: "pages#index"
  # ユーザー認証用
  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions"
  }

  # ゲストログイン用
  devise_scope :user do
    post "users/guest_sign_in", to: "users/sessions#guest_sign_in", as: :guest_sign_in
  end

  get "home", to: "home#index", as: :home
  get "home/summary", to: "home#summary", as: :home_summary

  resources :products, only: [ :new, :create, :edit, :update, :destroy ]
  resources :shops
  resources :records
  resources :categories do
    resources :products, only: [ :index, :new, :create ]
  end
  resource :profile, only: [ :show, :edit, :update ] do
    get "edit_email"
    patch "update_email"
  end

  get "settings", to: "settings#index"
  get "lists", to: "lists#index", as: :lists
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
