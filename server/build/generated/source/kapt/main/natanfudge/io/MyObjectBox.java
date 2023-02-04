
package natanfudge.io;

import io.objectbox.BoxStore;
import io.objectbox.BoxStoreBuilder;
import io.objectbox.ModelBuilder;
import io.objectbox.ModelBuilder.EntityBuilder;
import io.objectbox.model.PropertyFlags;
import io.objectbox.model.PropertyType;

// THIS CODE IS GENERATED BY ObjectBox, DO NOT EDIT.
/**
 * Starting point for working with your ObjectBox. All boxes are set up for your objects here.
 * <p>
 * First steps (Android): get a builder using {@link #builder()}, call {@link BoxStoreBuilder#androidContext(Object)},
 * and {@link BoxStoreBuilder#build()} to get a {@link BoxStore} to work with.
 */
public class MyObjectBox {

    public static BoxStoreBuilder builder() {
        BoxStoreBuilder builder = new BoxStoreBuilder(getModel());
        builder.entity(User_.__INSTANCE);
        return builder;
    }

    private static byte[] getModel() {
        ModelBuilder modelBuilder = new ModelBuilder();
        modelBuilder.lastEntityId(1, 8839141575972601853L);
        modelBuilder.lastIndexId(0, 0L);
        modelBuilder.lastRelationId(0, 0L);

        buildEntityUser(modelBuilder);

        return modelBuilder.build();
    }

    private static void buildEntityUser(ModelBuilder modelBuilder) {
        EntityBuilder entityBuilder = modelBuilder.entity("User");
        entityBuilder.id(1, 8839141575972601853L).lastPropertyId(2, 1376947530726005155L);

        entityBuilder.property("id", PropertyType.Long).id(1, 7258443613834632284L)
                .flags(PropertyFlags.ID);
        entityBuilder.property("name", PropertyType.String).id(2, 1376947530726005155L);


        entityBuilder.entityDone();
    }


}
