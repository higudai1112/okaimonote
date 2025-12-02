class ProfilesController < ApplicationController
  def show
    @user = current_user
  end

  def edit
    @user = current_user
  end

  def update
    @user = current_user
    if @user.update(user_params)
      redirect_to profile_path, notice: "プロフィールを更新しました"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def edit_email
    @user = current_user
  end

  def update_email
    @user = current_user

    if @user.valid_password?(params[:user][:current_password])
      if @user.update(user_params)
        redirect_to profile_path, notice: "メールアドレスを更新しました"
      else
        flash.now[:alert] = "更新できませんでした"
        render :edit_email, status: :unprocessable_entity
      end
    else
      flash.now[:alert] = "パスワードが正しくありません"
      render :edit_email, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:nickname, :avatar, :prefecture)
  end
end
