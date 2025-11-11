class ApplicationMailer < ActionMailer::Base
  default(
    from: "おかいもノート <noreply@mail.okaimonote.com>",
    charset: "UTF-8",
    content_type: "text/html"
  )
  layout "mailer"
end
