package com.gis.config;

import com.gis.enums.ERole;
import com.gis.enums.UserStatus;
import com.gis.model.*;
import com.gis.repository.*;
import com.gis.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class InitAppConfig {
    @Value("${app.admin.email}")
    private String ADMIN_EMAIL;

    @Value("${app.admin.password}")
    private String ADMIN_PASSWORD;

    private final UserRepository userRepository;
    private final TypeRepository typeRepository;
    private final FreightRateRepository freightRateRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final PriceRepository priceRepository;
    private final CriteriaRepository criteriaRepository;
    private final PasswordUtil passwordUtil;

    @Bean
    ApplicationRunner applicationRunner() {
        return args -> {
            initAdminAccount();
            initTypes();
            initFreightRate();
            initVehicleType();
            initPrice();
            initCriteria();
        };
    }

    private void initAdminAccount() {
        boolean isExistedAdmin = userRepository.existsByUsername(ADMIN_EMAIL);
        if (isExistedAdmin) return;
        User admin = User.builder()
                .username(ADMIN_EMAIL)
                .email(ADMIN_EMAIL)
                .phone("0000000000")
                .name("Root Admin")
                .gender(true)
                .password(passwordUtil.encodePassword(ADMIN_PASSWORD))
                .status(UserStatus.ACTIVE)
                .role(ERole.ADMIN)
                .build();
        userRepository.save(admin);
    }

    private void initTypes() {
        if (typeRepository.count() > 0) return;
        List<Type> defaultTypes = List.of(
                new Type("Thành viên", 0.0, 0L),
                new Type("Bạc", 0.1, 10000L),
                new Type("Vàng", 0.2, 100000L),
                new Type("Kim cương", 0.3, 1000000L)
        );
        typeRepository.saveAll(defaultTypes);
    }

    private void initFreightRate(){
        if (freightRateRepository.count() > 0) return;
        List<FreightRate> defaultFreightRates = List.of(
                new FreightRate(1, 0),
                new FreightRate(5,1),
                new FreightRate(10, 5),
                new FreightRate(100, 10)
        );
        freightRateRepository.saveAll(defaultFreightRates);
    }

    private void initVehicleType(){
        if (vehicleTypeRepository.count() > 0) return;
        List<VehicleType> defaultVehicleTypes = List.of(
                new VehicleType("Vinfast VF3", 4),
                new VehicleType("Vinfast VF5", 5),
                new VehicleType("Vinfast VF5 Plus", 5),
                new VehicleType("Vinfast VF9", 7),
                new VehicleType("Vinfast VF9 Plus", 7)
        );
        vehicleTypeRepository.saveAll(defaultVehicleTypes);
    }

    private void initPrice(){
        FreightRate fr1 = freightRateRepository.findByUpperAndLower(1, 0);
        FreightRate fr2 = freightRateRepository.findByUpperAndLower(5 , 1);
        FreightRate fr3 = freightRateRepository.findByUpperAndLower(10,5);
        FreightRate fr4 = freightRateRepository.findByUpperAndLower(100,10);

        VehicleType vh1 = vehicleTypeRepository.findByModel("Vinfast VF3");
        VehicleType vh2 = vehicleTypeRepository.findByModel("Vinfast VF5");
        VehicleType vh3 = vehicleTypeRepository.findByModel("Vinfast VF5 Plus");
        VehicleType vh4 = vehicleTypeRepository.findByModel("Vinfast VF9");
        VehicleType vh5 = vehicleTypeRepository.findByModel("Vinfast VF9 Plus");

        if(priceRepository.count() > 0) return;
        List<Price> defaultPrices = List.of(
                new Price(LocalDateTime.now(), 10000.0, fr1, vh1), //0-1: 10.000
                new Price(LocalDateTime.now(), 15000.0, fr2, vh1), //1-5: 15.000
                new Price(LocalDateTime.now(), 12000.0, fr3, vh1), //5-10: 12.000
                new Price(LocalDateTime.now(), 10000.0, fr4, vh1), //10-100: 10.000

                new Price(LocalDateTime.now(), 12000.0, fr1, vh2), //0-1: 12.000
                new Price(LocalDateTime.now(), 18000.0, fr2, vh2), //1-5: 18.000
                new Price(LocalDateTime.now(), 15000.0, fr3, vh2), //5-10: 15.000
                new Price(LocalDateTime.now(), 12000.0, fr4, vh2), //10-100: 12.000

                new Price(LocalDateTime.now(), 12000.0, fr1, vh3), //0-1: 12.000
                new Price(LocalDateTime.now(), 18000.0, fr2, vh3), //1-5: 18.000
                new Price(LocalDateTime.now(), 15000.0, fr3, vh3), //5-10: 15.000
                new Price(LocalDateTime.now(), 12000.0, fr4, vh3), //10-100: 12.000

                new Price(LocalDateTime.now(), 15000.0, fr1, vh4), //0-1: 12.000
                new Price(LocalDateTime.now(), 20000.0, fr2, vh4), //1-5: 18.000
                new Price(LocalDateTime.now(), 18000.0, fr3, vh4), //5-10: 15.000
                new Price(LocalDateTime.now(), 15000.0, fr4, vh4), //10-100: 12.000

                new Price(LocalDateTime.now(), 15000.0, fr1, vh5), //0-1: 12.000
                new Price(LocalDateTime.now(), 20000.0, fr2, vh5), //1-5: 18.000
                new Price(LocalDateTime.now(), 18000.0, fr3, vh5), //5-10: 15.000
                new Price(LocalDateTime.now(), 15000.0, fr4, vh5)  //10-100: 12.000
        );
        priceRepository.saveAll(defaultPrices);
    }

    private void initCriteria(){
        if(criteriaRepository.count() > 0) return;
        List<Criteria> defaultCriteria = List.of(
                new Criteria("Mức độ an toàn"),
                new Criteria("Thái độ phục vụ"),
                new Criteria("Tình trạng xe"),
                new Criteria("Đúng giờ")
        );
        criteriaRepository.saveAll(defaultCriteria);
    }
}

