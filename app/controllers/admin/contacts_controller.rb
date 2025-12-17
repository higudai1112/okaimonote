class Admin::ContactsController < Admin::BaseController
  def index
    @q = Contact.ransack(params[:q])
    @contacts = @q.result.order(created_at: :desc).page(params[:page]).per(20)
  end

  def show
    @contact = Contact.find(params[:id])
  end

  def update
    @contact = Contact.find(params[:id])
    if @contact.update(contact_params)
      redirect_to admin_contact_path(@contact), notice: "ステータスを更新しました"
    else
      redirect_to admin_contact_path(@contact), alert: "更新できませんでした"
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:status, :admin_memo)
  end
end
