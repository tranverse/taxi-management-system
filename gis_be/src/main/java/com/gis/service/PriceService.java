package com.gis.service;

import com.gis.dto.price.PriceRequest;
import com.gis.dto.price.PriceResponse;
import com.gis.model.FreightRate;
import com.gis.model.Price;
import com.gis.model.VehicleType;
import com.gis.repository.PriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PriceService {
    private final PriceRepository priceRepository;

    public PriceResponse calculatePrice(PriceRequest request) {
        Double km = request.getKilometer();
        List<Price> prices = priceRepository.findByVehicleType(request.getVehicleType());
        prices.sort(Comparator.comparing(p -> p.getFreightRate().getLower()));
        double totalPrice = 0;
        for (Price price : prices) {
            FreightRate rate = price.getFreightRate();
            double applicableKm = Math.min(km, rate.getUpper() - rate.getLower());
            totalPrice += applicableKm * price.getPrice();
            km -= applicableKm;
            if (km <= 0) break;
        }
        // Nếu vẫn còn km dư sau khi trừ hết các cận, tính 10.000 VND/km
        if (km > 0) {
            totalPrice += km * 10_000;
        }
        return PriceResponse.builder()
                .price(totalPrice)
                .build();
    }
}

