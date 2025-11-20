RSpec.configure do |config|
  config.before(:each) do
    allow(URI).to receive(:open).and_return(StringIO.new("fake image data"))
  end
end
