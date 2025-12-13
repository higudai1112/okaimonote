Rails.application.routes.draw do
  root to: "pages#index"
  # ユーザー認証用
  devise_for :users, controllers: {
    registrations: "users/registrations",
    sessions: "users/sessions",
    omniauth_callbacks: "users/omniauth_callbacks"
  }

  get "guide", to: "pages#guide", as: :guide
  get "home", to: "home#index", as: :home
  get "home/summary/:id", to: "home#show_summary", as: :home_summary
  get "home/autocomplete", to: "home#autocomplete"

  # 管理者画面関係
  namespace :admin do
    root "dashboards#index"

    resources :users, only: [ :index, :show, :update ] do
      member do
        patch :ban
        patch :unban
      end
    end
    resources :families, only: [ :index, :show ] do
      patch :change_admin, on: :member
      member do
        delete "remove_member/:user_id", to: "families#remove_member", as: :remove_member
      end
    end
    resources :contacts, only: [ :index, :show, :update ]
    resources :stats, only: [ :index ]
    resource  :service, only: [ :show ]
    resource  :settings, only: [ :show ]
    resources :abnormal_prices, only: [ :index ]
  end

  resources :products, only: [ :index, :new, :create, :show, :edit, :update, :destroy ] do
    collection do
      get :autocomplete
      get :search
    end
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
  get "shopping_items/autocomplete", to: "shopping_items#autocomplete"

  resource :settings, only: [ :show ]
  get "register_info", to: "pages#register_info", as: :register_info

  # 家族関連(基本)
  resource :family, only: [ :new, :create, :show, :edit, :update, :destroy ] do
    delete :leave
    post   :regenerate_invite
    patch  :transfer_owner
  end

  # 招待リンク(URLにtokenあり)
  get "/family/invite/:token", to: "family_invites#show", as: :family_invite
  post "/family/invite/:token", to: "family_invites#join"
  # ファミリー参加(招待コード手入力)
  get  "/family/join", to: "family_invites#enter_code", as: :enter_family_code
  post "/family/join", to: "family_invites#apply_code", as: :apply_family_code

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
