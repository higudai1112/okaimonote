Rails.application.routes.draw do
  root to: "pages#index"
  # ユーザー認証用
  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions"
  }

  get "home", to: "home#index", as: :home
  get "home/summary", to: "home#summary", as: :home_summary

  resources :products, only: [ :index, :new, :create, :show, :edit, :update, :destroy ] do
    resources :price_records, only: [ :new, :create, :edit, :update, :destroy ]
  end
  resources :price_records, only: [ :new, :create ]
  resources :shops
  resources :categories do
    resources :products, only: [ :index, :show, :new, :create, :edit, :update, :destroy ]
  end
  resource :profile, only: [ :show, :edit, :update ] do
    get "edit_email"
    patch "update_email"
  end
  resource :shopping_list, only: [ :show ] do
    resources :shopping_items, only: [ :create, :update, :edit, :destroy ]
    delete :delete_purchased, on: :collection
  end
  get "lists", to: "lists#index", as: :lists

  resource :settings, only: [ :show ]
  get "register_info", to: "pages#register_info", as: :register_info

  # 利用規約・プライバシー・お問い合わせ
  get "terms", to: "settings#terms", as: :terms
  get "privacy", to: "settings#privacy", as: :privacy
  get "contact", to: "settings#contact", as: :contact
  post "contact", to: "settings#send_contact"
  get "thank_you", to: "settings#thank_you", as: :thank_you
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
