require "spec_helper"

describe 'MyVideos' do
  context 'when request params yield a valid response' do
    let!(:request) { MyVideos.new(:ccns => '2013D7309,2013D7366') }
    it 'should populate @my_videos[:videos]' do
      request.get_videos_as_json
      expect(request.my_videos[:videos]).not_to be_empty
    end
  end
end
