require "spec_helper"

describe 'MyVideos' do

  context 'when the requested CCNs exist' do
    let!(:api) { MyVideos.new(:ccns => '2013D7309,2013D7366') }
    it 'should populate @my_videos[:videos]' do
      api.get_videos_as_json
      expect(api.my_videos[:videos]).not_to be_empty
    end
  end

  context 'when the requested CCNs do not exist' do
    let!(:api) { MyVideos.new(:ccns => '6347D7999,5436D7466,345347752') }
    it 'should not populate @my_videos[:videos]' do
      api.get_videos_as_json
      expect(api.my_videos[:videos]).to be_empty
    end
  end

  context 'when the base_url is invalid, .request(url) is given an invalid url' do
    let!(:api) { MyVideos.new(:base_url => 'http://a.ets.berkeley.edu/search/paellaEpisodeListing.json?q=&sid=') }
    it 'should return false' do
      request_url = api.build_url('2013D7309')
      expect(api.request(request_url)).to be_false
    end
  end

end
