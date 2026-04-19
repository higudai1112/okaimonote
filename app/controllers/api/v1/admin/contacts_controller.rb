module Api
  module V1
    module Admin
      class ContactsController < BaseController
        before_action :set_contact, only: [ :show, :update ]

        def index
          contacts = Contact.order(created_at: :desc)

          if params[:status].present?
            contacts = contacts.where(status: params[:status])
          end

          total    = contacts.count
          page     = (params[:page] || 1).to_i
          per      = 20
          contacts = contacts.offset((page - 1) * per).limit(per)

          render json: {
            contacts: contacts.map { |c| contact_json(c) },
            meta: { total: total, page: page, per: per }
          }
        end

        def show
          render json: contact_json(@contact)
        end

        def update
          if @contact.update(contact_params)
            render json: contact_json(@contact)
          else
            render json: { errors: @contact.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def set_contact
          @contact = Contact.find(params[:id])
        end

        def contact_params
          params.require(:contact).permit(:status, :admin_memo)
        end

        def contact_json(contact)
          {
            id: contact.id,
            nickname: contact.nickname,
            email: contact.email,
            body: contact.body,
            status: contact.status,
            admin_memo: contact.admin_memo,
            created_at: contact.created_at
          }
        end
      end
    end
  end
end
