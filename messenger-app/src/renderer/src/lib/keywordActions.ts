const keywordActions = [
  {
    keywords: ['tìm hiểu về sản phẩm', 'xem sản phẩm', 'chi tiết sản phẩm'],
    response: {
      message: 'Dưới đây là các sản phẩm nổi bật của chúng tôi:',
      buttonText: 'Xem Sản Phẩm',
      buttonAction: () => {
        console.log('VIEW_PRODUCT clicked')
      }
    }
  },
  {
    keywords: ['mua sản phẩm', 'đặt hàng', 'mua ngay'],
    response: {
      message: 'Bạn có thể mua sản phẩm này ngay bây giờ.',
      buttonText: 'Mua Ngay',
      buttonAction: () => {
        console.log('BUY_PRODUCT clicked')
      }
    }
  },
  {
    keywords: ['thêm vào giỏ hàng', 'giỏ hàng', 'thêm sản phẩm vào giỏ'],
    response: {
      message: 'Thêm sản phẩm này vào giỏ hàng của bạn.',
      buttonText: 'Thêm Vào Giỏ Hàng',
      buttonAction: () => {
        console.log('ADD_TO_CART clicked')
      }
    }
  },
  {
    keywords: ['liên hệ', 'hỗ trợ', 'giúp đỡ'],
    response: {
      message: 'Liên hệ với hỗ trợ của chúng tôi.',
      buttonText: 'Liên Hệ Hỗ Trợ',
      buttonAction: () => {
        console.log('CONTACT_SUPPORT clicked')
      }
    }
  },
  {
    keywords: ['chia sẻ', 'gửi cho bạn bè', 'chia sẻ sản phẩm'],
    response: {
      message: 'Chia sẻ sản phẩm này với bạn bè của bạn.',
      buttonText: 'Chia Sẻ Sản Phẩm',
      buttonAction: () => {
        console.log('SHARE_PRODUCT clicked')
      }
    }
  },
  {
    keywords: ['khuyến mãi', 'giảm giá', 'ưu đãi'],
    response: {
      message: 'Nhận thông báo về khuyến mãi đặc biệt.',
      buttonText: 'Khuyến Mãi Đặc Biệt',
      buttonAction: () => {
        console.log('SPECIAL_OFFER clicked')
      }
    }
  }
  // Add more keywords and responses as needed
]

export default keywordActions
