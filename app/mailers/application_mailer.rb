class ApplicationMailer < ActionMailer::Base
  default(
    from: "okaimonote.team@gmail.com",
    charset: "UTF-8",
    content_type: "text/html"
  )
  layout "mailer"
end
