// Helper function to calculate cart totals
export const calculateCartTotals = (cartItems) => {
    const currentDate = new Date();
  
    return cartItems.reduce(
      (totals, item) => {
        const { offer, salePrice, offerPrice } = item.productId;
  
        const validSalePrice = salePrice ?? 0;
        const validOfferPrice = offerPrice ?? validSalePrice;
        const hasOffer = !!(offer && offer.startDate && offer.endDate);
        const isOfferActive =
          hasOffer &&
          new Date(offer.startDate) <= currentDate &&
          new Date(offer.endDate) >= currentDate;
        const applicablePrice = isOfferActive ? validOfferPrice : validSalePrice;
  
        // Update cartTotal and MRP
        totals.cartTotal += applicablePrice * item.quantity;
        totals.totalMRP += validSalePrice * item.quantity;
  
        // Calculate discount if offer is active
        if (isOfferActive) {
          const discountPerItem = validSalePrice - validOfferPrice;
          totals.totalDiscount += discountPerItem * item.quantity;
        }
  
        return totals;
      },
      { cartTotal: 0, totalDiscount: 0, totalMRP: 0 }
    );
  };
  


  