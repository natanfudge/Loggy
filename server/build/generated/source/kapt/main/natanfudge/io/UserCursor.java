package natanfudge.io;

import io.objectbox.BoxStore;
import io.objectbox.Cursor;
import io.objectbox.annotation.apihint.Internal;
import io.objectbox.internal.CursorFactory;

// THIS CODE IS GENERATED BY ObjectBox, DO NOT EDIT.

/**
 * ObjectBox generated Cursor implementation for "User".
 * Note that this is a low-level class: usually you should stick to the Box class.
 */
public final class UserCursor extends Cursor<User> {
    @Internal
    static final class Factory implements CursorFactory<User> {
        @Override
        public Cursor<User> createCursor(io.objectbox.Transaction tx, long cursorHandle, BoxStore boxStoreForEntities) {
            return new UserCursor(tx, cursorHandle, boxStoreForEntities);
        }
    }

    private static final User_.UserIdGetter ID_GETTER = User_.__ID_GETTER;


    private final static int __ID_name = User_.name.id;

    public UserCursor(io.objectbox.Transaction tx, long cursor, BoxStore boxStore) {
        super(tx, cursor, User_.__INSTANCE, boxStore);
    }

    @Override
    public long getId(User entity) {
        return ID_GETTER.getId(entity);
    }

    /**
     * Puts an object into its box.
     *
     * @return The ID of the object within its box.
     */
    @SuppressWarnings({"rawtypes", "unchecked"}) 
    @Override
    public long put(User entity) {
        String name = entity.getName();
        int __id1 = name != null ? __ID_name : 0;

        long __assignedId = collect313311(cursor, entity.getId(), PUT_FLAG_FIRST | PUT_FLAG_COMPLETE,
                __id1, name, 0, null,
                0, null, 0, null,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0);

        entity.setId(__assignedId);

        return __assignedId;
    }

}
